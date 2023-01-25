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
import { CreateUserDto } from './dto/create-user.dto';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HandleInviteDto } from './dto/handle-invite.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates user
   * @param {CreateUserDto} createUserDto
   * @returns {User} user
   *
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Returns logged user's data
   * @returns {User} user data of the token owner
   * @param req - from AccessTokenGuard
   */
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

  @UseGuards(AccessTokenGuard)
  @Post('handleinvite')
  handleInvite(@Req() req: Request, @Body() handleInviteDto: HandleInviteDto) {
    return this.usersService.handleInvite(
      req.user['username'],
      handleInviteDto,
    );
  }

  @Get('search/user')
  searchByUsername(
    @Query('username') username: string,
    @Query('team') team: boolean,
  ) {
    // return { username, team };
    return this.usersService.findLikeUsername(username, team);
  }

  /**
   * Allows user to modify his data
   * @param req - passed from request by AccessTokenGuard
   * @param updateSelfDto
   */
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  update(@Req() req: Request, @Body() updateSelfDto: UserUpdateSelfDto) {
    return this.usersService.updateSelf(req.user['username'], updateSelfDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('leaveTeam')
  leaveTeam(@Req() req: Request) {
    return this.usersService.leaveTeam(req['user']);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('msg/:index')
  deleteMsgAtIndex(@Req() req: Request, @Param('index') index: number) {
    return this.usersService.deleteMsgAtIndex(index, req.user['username']);
  }

  /**
   * Lets Admin remove user account
   * @param id
   */
  @Roles('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
