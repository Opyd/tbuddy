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
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Request } from 'express';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { ApiTags } from '@nestjs/swagger';
import { MatchResultDto } from './dto/match-result.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { KickFromTournamentDto } from './dto/kick-from-tournament.dto';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  /**
   * Creates new tournament
   * @param req - logged user
   * @param createTournamentDto - basic info about tournaments
   * @returns {Tournament} new Tournament document
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createTournamentDto: CreateTournamentDto,
  ) {
    return this.tournamentsService.create(req['user'], createTournamentDto);
  }

  /**
   * Allows team owner join a specified tournament
   * @param req - logged user
   * @param tournamentid - tournament id
   * @returns {Tournament} updated tournament document
   */
  @UseGuards(AccessTokenGuard)
  @Post('join/:tournamentid')
  async joinTournaments(
    @Req() req: Request,
    @Param('tournamentid') tournamentid: string,
  ) {
    return this.tournamentsService.joinTournament(req['user'], tournamentid);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('kick/:tournamentid')
  async kickFromTournament(
    @Req() req: Request,
    @Param('tournamentid') tournamentid: string,
    @Body() kickFromTournamentDto: KickFromTournamentDto,
  ) {
    return await this.tournamentsService.kickFromTournament(
      req['user']['username'],
      tournamentid,
      kickFromTournamentDto,
    );
  }

  /**
   * Starts tournament (seeding brackets)
   * @param req
   * @param tournamentid {string}
   */
  @UseGuards(AccessTokenGuard)
  @Patch('start/:tournamentid')
  async startTournament(
    @Req() req: Request,
    @Param('tournamentid') tournamentid: string,
  ) {
    return this.tournamentsService.startTournament(req['user'], tournamentid);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('description/:tournamentid')
  async changeDescription(
    @Req() req: Request,
    @Param('tournamentid') tournamentid: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.changeDescription(
      req['user'],
      tournamentid,
      updateTournamentDto,
    );
  }

  /**
   * Allows to set match result and pick a winner
   * @param req {Request}
   * @param matchResultDto {MatchResultDto}
   * @param tournamentid {string}
   */
  @UseGuards(AccessTokenGuard)
  @Patch('match/:tournamentid')
  async setMatchResult(
    @Req() req: Request,
    @Body() matchResultDto: MatchResultDto,
    @Param('tournamentid') tournamentid: string,
  ) {
    return this.tournamentsService.setMatchResult(
      tournamentid,
      req['user'],
      matchResultDto,
    );
  }

  /**
   * Returns all existing tournaments
   */
  @Get()
  async findAll() {
    return await this.tournamentsService.findAll();
  }

  /**
   * Returns specific tournament
   * @param id
   */
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.tournamentsService.findTournamentBySlug(slug);
  }
  @Get('/id/:id')
  async findById(@Param('id') id: string) {
    return await this.tournamentsService.findTournamentById(id);
  }

  @Get('/:id/team/:tag')
  async getTeamMatches(@Param('id') id: string, @Param('tag') tag: string) {
    return await this.tournamentsService.getTeamMatches(id, tag);
  }

  @Get('new')
  async getNewestTournament() {
    return await this.tournamentsService.getNewestTournament();
  }

  @Get('finished')
  async getFinishedTournament() {
    return await this.tournamentsService.getFinishedTournament();
  }

  @Get('search/:query')
  async searchByQuery(@Param('query') query: string) {
    return await this.tournamentsService.searchTournament(query);
  }
}
