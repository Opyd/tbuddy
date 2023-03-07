import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HandleInviteDto } from './dto/handle-invite.dto';

/**
 * Controller for Users Module, for endpoints specific to user's actions
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Injecting service
   * @param usersService {UsersService}
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Returns logged user's data
   * @returns {User} user data of the token owner
   * @param req - from AccessTokenGuard
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async findLogged(@Req() req: Request) {
    return await this.usersService.findLoggedUser(req.user['username']);
  }

  /**
   * Returns specified user's data
   * @returns {User} - user data
   * @param id {string} - ID of user
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Return specified user's data
   * @param username {string} - user's username
   */
  @Get('name/:username')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    const cleared = user.toObject();
    delete cleared.refreshToken;
    delete cleared.password;
    return cleared;
  }

  /**
   * Allows user to accept/decline invite
   * @param req
   * @param handleInviteDto {HandleInviteDto}
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('handleinvite')
  handleInvite(@Req() req: Request, @Body() handleInviteDto: HandleInviteDto) {
    return this.usersService.handleInvite(
      req.user['username'],
      handleInviteDto,
    );
  }

  /**
   * Used for searching users
   * @param username {String}
   * @param team {String} - if present, will look for user that are also in teams
   */
  @Get('search/user')
  searchByUsername(
    @Query('username') username: string,
    @Query('team') team: boolean,
  ) {
    return this.usersService.findLikeUsername(username, team);
  }

  /**
   * Allows user to modify his data
   * @param req - passed from request by AccessTokenGuard
   * @param updateSelfDto
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  update(@Req() req: Request, @Body() updateSelfDto: UserUpdateSelfDto) {
    return this.usersService.updateSelf(req.user['username'], updateSelfDto);
  }

  /**
   * Allows user to leave the team
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('leaveTeam')
  leaveTeam(@Req() req: Request) {
    return this.usersService.leaveTeam(req['user']);
  }

  /**
   * Deletes msg from user's inbox
   * @param req
   * @param index {number}
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete('msg/:index')
  deleteMsgAtIndex(@Req() req: Request, @Param('index') index: number) {
    return this.usersService.deleteMsgAtIndex(index, req.user['username']);
  }
}
