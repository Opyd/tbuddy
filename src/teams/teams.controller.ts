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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { UsersService } from '../users/users.service';
import { Team, TeamSchema } from './schema/team.schema';

/**
 * Collection of teams specific endpoints
 */
@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  /**
   * Injecting required dependencies
   * @param teamsService {TeamsService}
   * @param userService {UsersService}
   */
  constructor(
    private readonly teamsService: TeamsService,
    private userService: UsersService,
  ) {}

  /**
   * Creating new tournament
   * @param req {Request}
   * @param createTeamDto {CreateTeamDto}
   */
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Returns created team object',
    type: Team,
  })
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

  /**
   * Returns all teams
   */
  @ApiOkResponse({
    description: 'Returns all teams',
    type: [Team],
  })
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  /**
   * Returns specific team by tag
   * @param tag {String}
   */
  @ApiOkResponse({
    type: Team,
  })
  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.teamsService.findOneByTag(tag);
  }

  /**
   * Checks if given team exists (used in create team page)
   * @param tag {String}
   * @return {boolean} exists
   */
  @ApiOkResponse({
    description: 'Returns true if team was found, false if not',
  })
  @Get('exists/:tag')
  checkIfTeamExists(@Param('tag') tag: string) {
    return this.teamsService.checkIfTeamExists(tag);
  }

  /**
   * Returns team by id
   * @param id {String}
   */
  @ApiOkResponse({
    description: 'Returns team',
    type: Team,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  /**
   * Searches for and returns team if found
   * @param query {String}
   */
  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.teamsService.searchTeam(query);
  }

  /**
   * Invites user to join the team
   * @param req {Request}
   * @param inviteUserDto {InviteUserDto}
   */
  @ApiCreatedResponse({
    description: 'Returns updated team',
    type: Team,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('invite')
  inviteUserToTeam(@Req() req: Request, @Body() inviteUserDto: InviteUserDto) {
    return this.teamsService.inviteUser(req.user['username'], inviteUserDto);
  }

  /**
   * Updates specified by id team
   * @param id {String}
   * @param updateTeamDto {UpdateTeamDto}
   */
  @ApiCreatedResponse({
    description: 'Returns updated team',
    type: Team,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  /**
   * Removes user from the team
   * @param req {Request}
   * @param username {String}
   */
  @ApiOkResponse({
    type: Team,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('removeuser/:username')
  removeUserFromTeam(@Req() req: Request, @Param('username') username: string) {
    return this.teamsService.removeUserFromTeam(req.user['username'], username);
  }

  /**
   * Removes pending invite
   * @param req {Request}
   * @param username {String}
   */
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('removeinvite/:username')
  removeInvite(@Req() req: Request, @Param('username') username: string) {
    return this.teamsService.removeInvite(req.user['username'], username);
  }
}
