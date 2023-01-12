import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from '../teams/schema/team.schema';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from './schemas/tournament.schema';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { UserRoles } from '../users/schemas/user.schema';

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

    await organizer.updateOne({ role: UserRoles.ORGANIZER }).exec();

    return await new this.tournamentModel({
      title,
      description,
      nrOfTeams,
      organizer: organizer.username,
    }).save();
  }

  async findTournamentById(id: string) {
    return await this.tournamentModel.findById(id).exec();
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
    const user = await this.userService.findByUsername(organizer['username']);

    if (user.username !== tournament.organizer) {
      throw new BadRequestException('User is not a tournament organizer');
    }

    if (!(tournament.participants.length === tournament.nrOfTeams)) {
      throw new BadRequestException('Not enough teams');
    }

    const stagesNr = Math.log(tournament.participants.length) / Math.log(2);

    const stages = [];

    const participants = tournament.participants.sort(
      () => Math.random() - 0.5,
    );

    for (let i = 0; i < stagesNr; i++) {
      stages.push({ matches: [], finished: false, stageNr: i });
    }

    for (let i = 0; i < participants.length; i += 2) {
      stages[0].matches.push({
        teamA: participants[i],
        teamB: participants[i + 1],
        winner: 'null',
        result: '',
      });
    }

    return await tournament.updateOne({ stages }, { new: true }).exec();
  }
}
