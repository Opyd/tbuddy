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
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { InviteUserDto } from './dto/invite-user.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
