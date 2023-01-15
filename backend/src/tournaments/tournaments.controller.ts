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
  @Patch('join/:tournamentid')
  async joinTournaments(
    @Req() req: Request,
    @Param('tournamentid') tournamentid: string,
  ) {
    return this.tournamentsService.joinTournament(req['user'], tournamentid);
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

  /**
   * Allows to set match result and pick a winner
   * @param req {Request}
   * @param matchResultDto {MatchResultDto}
   * @param tournamentid {string}
   */
  @UseGuards(AccessTokenGuard)
  @Patch(':tournamentid/match')
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
  @Get(':slug')
  async findById(@Param('slug') slug: string) {
    return await this.tournamentsService.findTournamentBySlug(slug);
  }
}
