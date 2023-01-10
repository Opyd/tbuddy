import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { UsersService } from '../users/users.service';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private userService: UsersService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Req() req: Request, @Body() createTeamDto: CreateTeamDto) {
    const user = await this.userService.findByUsername(req.user['username']);
    if (user.username !== createTeamDto.owner) {
      throw new BadRequestException('Usernames mismatch');
    }
    if (user.currentTeam !== null) {
      throw new BadRequestException(
        'User already in team. Leave current team first',
      );
    }

    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.teamsService.findOneByTag(tag);
  }

  /**
   * Checks if given team exists (used in create team page)
   * @param tag
   * @return {boolean} exists
   */
  @Get('exists/:tag')
  checkIfTeamExists(@Param('tag') tag: string) {
    return this.teamsService.checkIfTeamExists(tag);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.teamsService.searchTeam(query);
  }

  @UseGuards(AccessTokenGuard)
  @Post('invite')
  inviteUserToTeam(@Req() req: Request, @Body() inviteUserDto: InviteUserDto) {
    return this.teamsService.inviteUser(req.user['username'], inviteUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('removeuser/:username')
  removeUserFromTeam(@Req() req: Request, @Param('username') username: string) {
    return this.teamsService.removeUserFromTeam(req.user['username'], username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('removeinvite/:username')
  removeInvite(@Req() req: Request, @Param('username') username: string) {
    return this.teamsService.removeInvite(req.user['username'], username);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
