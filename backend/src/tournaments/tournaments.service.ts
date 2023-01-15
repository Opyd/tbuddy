import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from '../teams/schema/team.schema';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from './schemas/tournament.schema';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { UserRoles } from '../users/schemas/user.schema';
import { Match, MatchDocument } from './schemas/match.schema';
import { Stage, StageDocument, StageSchema } from './schemas/stage.schema';
import { MatchResultDto } from './dto/match-result.dto';
import * as stream from 'stream';
import slugify from 'slugify';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,

    private userService: UsersService,
    private teamsService: TeamsService,
  ) {}
  async create(user: Express.User, createTournamentDto: CreateTournamentDto) {
    const organizer = await this.userService.findByUsername(user['username']);

    if (organizer.currentTeam !== null) {
      throw new BadRequestException('User is in team');
    }

    const { title, description, nrOfTeams } = createTournamentDto;

    const slug: string = slugify(title) + Math.floor(Math.random() * 90 + 10);

    await organizer.updateOne({ role: UserRoles.ORGANIZER }).exec();

    return await new this.tournamentModel({
      title,
      slug,
      description,
      nrOfTeams,
      organizer: organizer.username,
    }).save();
  }

  async findTournamentById(id: string) {
    return await this.tournamentModel.findById(id).exec();
  }

  async findTournamentBySlug(slug: string) {
    return await this.tournamentModel.findOne({ slug }).exec();
  }

  async findAll() {
    return await this.tournamentModel.find({}).exec();
  }

  async joinTournament(user: Express.User, tournamentid: string) {
    const teamOwner = await this.userService.findByUsername(user['username']);

    if (teamOwner.currentTeam === null) {
      throw new BadRequestException('User not in team');
    }
    const team = await this.teamsService.findOneByTag(teamOwner.currentTeam);

    if (!team) {
      throw new BadRequestException('Team doesnt exists');
    }

    // if (team.members.length + 1 < 5) {
    //   throw new BadRequestException('Not enough members');
    // }

    if (team.owner !== teamOwner.username) {
      throw new BadRequestException('Users is not the teams owner');
    }

    const tournament = await this.findTournamentById(tournamentid);

    if (!tournament) {
      throw new BadRequestException('Tournament doesnt exists');
    }

    if (tournament.participants?.includes(team.tag)) {
      throw new BadRequestException('Team already participates');
    }

    await team.updateOne({ activeTournament: tournament._id }).exec();

    return await tournament
      .updateOne({ $push: { participants: team.tag } }, { new: true })
      .exec();
  }

  async startTournament(organizer: Express.User, tournamentid: string) {
    const tournament = await this.findTournamentById(tournamentid);
    if (!tournament) {
      throw new BadRequestException('Tournament doesnt exists');
    }
    if (tournament.started) {
      throw new BadRequestException('Tournament already started');
    }
    const user = await this.userService.findByUsername(organizer['username']);

    if (user.username !== tournament.organizer) {
      throw new BadRequestException('User is not a tournament organizer');
    }

    if (!(tournament.participants.length === tournament.nrOfTeams)) {
      throw new BadRequestException('Not enough teams');
    }

    let stagesNr = Math.log(tournament.participants.length) / Math.log(2);

    const stages = [];

    const participants = tournament.participants.sort(
      () => Math.random() - 0.5,
    );

    /**
     * Creates whole bracket with empty matches, used later for transferring winners to next stage
     */

    let stageCounter = 0;
    let matchesPerRound = participants.length / 2;
    while (stagesNr > 0) {
      const newStage = { finished: false, stageNr: stageCounter, matches: [] };
      for (let i = 0; i < matchesPerRound / 2; i++) {
        newStage.matches.push({
          teamA: null,
          teamB: null,
          winner: null,
          result: null,
          finished: false,
        });
      }
      matchesPerRound = matchesPerRound / 2;
      stages.push(newStage);
      stageCounter++;
      stagesNr--;
    }

    const firstStage = [];

    for (let i = 0; i < participants.length; i += 2) {
      firstStage.push({
        teamA: participants[i],
        teamB: participants[i + 1],
        winner: null,
        result: null,
        finished: false,
      });
    }

    stages[0].matches = firstStage;

    await tournament.updateOne({ stages, started: true }, { new: true }).exec();
    return tournament;
  }

  async setMatchResult(
    tournamentid: string,
    organizer: Express.User,
    matchResultDto: MatchResultDto,
  ) {
    const tournament = await this.findTournamentById(tournamentid);
    if (!tournament) {
      throw new BadRequestException('Tournament doesnt exists');
    }
    if (!tournament.started) {
      throw new BadRequestException('Tournament didnt start');
    }
    const user = await this.userService.findByUsername(organizer['username']);

    if (user.username !== tournament.organizer) {
      throw new BadRequestException('User is not a tournament organizer');
    }

    const { stageNr, winner, result } = matchResultDto;

    if (stageNr > 0 && !tournament.stages[stageNr - 1].finished) {
      throw new BadRequestException('Previous stage is not yet finished');
    }

    let matchIndex = 0;
    const matches = tournament.stages[stageNr].matches;

    /**
     * Looks for a match that will be updated
     */

    matches.map((match, index) => {
      if (match['id'] === matchResultDto.matchId) {
        matchIndex = index;
        if (match.teamA !== winner && match.teamB !== winner) {
          throw new BadRequestException('Invalid winner');
        }
        match.winner = winner;
        match.result = result;
        match.finished = true;
      }
    });

    tournament.stages[stageNr].matches = matches;

    /**
     * Moves winner to next round
     */

    if (stageNr < tournament.stages.length - 1) {
      const nextStage = stageNr + 1;
      const nextRoundMatchIndex = Math.floor(matchIndex / 2);
      const team = matchIndex % 2 === 0 ? 'teamA' : 'teamB';
      tournament.stages[nextStage].matches[nextRoundMatchIndex][team] = winner;
    }

    /**
     * Marks stage as finished, if every match has been finished
     */

    let allFinishedFlag = true;
    tournament.stages[stageNr].matches.forEach((match) => {
      if (!match.finished) allFinishedFlag = false;
    });

    tournament.stages[stageNr].finished = allFinishedFlag;

    await tournament.save();

    return tournament;
  }
}
