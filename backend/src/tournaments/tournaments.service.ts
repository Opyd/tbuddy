import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from './schemas/tournament.schema';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { UserRoles } from '../users/schemas/user.schema';
import { MatchResultDto } from './dto/match-result.dto';
import slugify from 'slugify';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { EventEnum } from '../teams/schema/team-events-history.schema';
import { KickFromTournamentDto } from './dto/kick-from-tournament.dto';

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

    await organizer.update({ role: UserRoles.ORGANIZER }).exec();

    return await new this.tournamentModel({
      title,
      slug,
      description,
      nrOfTeams,
      organizer: organizer.username,
    }).save();
  }

  async findTournamentById(id: string) {
    const tournament = await this.tournamentModel.findById(id).exec();
    if (!tournament) {
      throw new NotFoundException();
    }
    return tournament;
  }

  async findTournamentBySlug(slug: string) {
    const tournament = await this.tournamentModel.findOne({ slug }).exec();
    if (!tournament) {
      throw new NotFoundException();
    }
    return tournament;
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

    await tournament.updateOne(
      { $push: { participants: team.tag } },
      { new: true },
    );
    return team;
  }

  async kickFromTournament(
    organizer: string,
    tournamentId: string,
    kickFromTournamentDto: KickFromTournamentDto,
  ) {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) {
      throw new BadRequestException('Tournament doesnt exist');
    }
    const team = await this.teamsService.findOneByTag(
      kickFromTournamentDto.teamtag,
    );
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    if (tournament.organizer !== organizer) {
      throw new UnauthorizedException();
    }
    tournament.participants = tournament.participants.filter(
      (team) => team !== kickFromTournamentDto.teamtag,
    );
    team.activeTournament = null;

    await team.save();
    await tournament.save();
    return HttpStatus.OK;
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
      for (let i = 0; i < matchesPerRound; i++) {
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

    if (tournament.finished) {
      throw new BadRequestException('Tournament ended');
    }

    const { stageNr, winner, result, matchId } = matchResultDto;

    if (stageNr > 0 && !tournament.stages[stageNr - 1].finished) {
      throw new BadRequestException('Previous stage is not yet finished');
    }

    let matchIndex = 0;
    const matches = tournament.stages[stageNr].matches;

    /**
     * Looks for a match that will be updated
     */
    let teamAtag = '';
    let teamBtag = '';
    matches.map((match, index) => {
      if (match['id'] === matchId) {
        matchIndex = index;
        if (match.teamA !== winner && match.teamB !== winner) {
          throw new BadRequestException('Invalid winner');
        }
        teamAtag = match.teamA;
        teamBtag = match.teamB;
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

    const teamA = await this.teamsService.findOneByTag(teamAtag);
    const teamB = await this.teamsService.findOneByTag(teamBtag);
    const winnerTeam = teamA.tag === winner ? teamA : teamB;
    const loserTeam = teamA.tag !== winner ? teamA : teamB;

    if (stageNr === tournament.stages.length - 1) {
      tournament.finished = tournament.stages[stageNr].finished;
      winnerTeam.events.push({
        type: EventEnum.TOURNAMENT_WIN,
        date: new Date(),
        msg: `Team won "${tournament.title}" tournament!`,
      });
    }

    /**
     * Adding matches to teams' history
     */

    winnerTeam.history.push({
      opponent: loserTeam.tag,
      result: 'win',
      date: new Date(),
      matchId: matchId,
    });

    loserTeam.history.push({
      opponent: winnerTeam.tag,
      result: 'loss',
      date: new Date(),
      matchId: matchId,
    });

    loserTeam.events.push({
      type: EventEnum.TOURNAMENT_DROPPED,
      date: new Date(),
      msg: `Team dropped out from "${tournament.title}" in stage ${
        stageNr + 1
      } `,
    });

    await winnerTeam.save();
    await loserTeam.save();

    await tournament.save();

    return tournament;
  }

  async getTeamMatches(id: string, tag: string) {
    const tournament = await this.findTournamentById(id);
    if (!tournament) {
      throw new BadRequestException('Tournament doesnt exists');
    }
    if (!tournament.started) {
      throw new BadRequestException('Tournament didnt start');
    }
    const team = await this.teamsService.findOneByTag(tag);
    if (!team) {
      throw new BadRequestException('Team doesnt exists');
    }
    if (team.activeTournament !== tournament._id.toString()) {
      throw new BadRequestException(
        'Team doesnt participate in this tournament',
      );
    }
    const opponents = [];
    tournament.stages.forEach((stage) => {
      stage.matches.forEach((match) => {
        if (match.teamA === team.tag || match.teamB === team.tag) {
          if (match.finished !== true) {
            opponents.push(
              team.tag === match.teamA ? match.teamB : match.teamA,
            );
          }
        }
      });
    });
    const opponentsObjects = [];
    for (let i = 0; i < opponents.length; i++) {
      if (opponents[i] === '') {
        continue;
      }
      const team = await this.teamsService.findOneByTag(opponents[i]);
      opponentsObjects.push(team);
    }
    return opponentsObjects;
  }

  async changeDescription(
    organizer: Express.User,
    tournamentid: string,
    updateTournamentDto: UpdateTournamentDto,
  ) {
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

    tournament.description = updateTournamentDto.description;
    await tournament.save();
    return tournament;
  }

  async getNewestTournament() {
    return await this.tournamentModel.findOne().sort({ createdAt: -1 }).exec();
  }
  async getFinishedTournament() {
    return await this.tournamentModel
      .findOne({ finished: true })
      .sort({ created_at: -1 })
      .exec();
  }

  async searchTournament(query: string) {
    return this.tournamentModel
      .find({
        title: new RegExp('.*' + query + '.*', 'i'),
      })
      .select({
        title: 1,
        organizer: 1,
        slug: 1,
        finished: 1,
        started: 1,
        participants: 1,
        nrOfTeams: 1,
      });
  }
}
