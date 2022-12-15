import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './schema/team.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private userService: UsersService,
  ) {}

  create(createTeamDto: CreateTeamDto) {
    return new this.teamModel(createTeamDto).save();
  }

  findAll() {
    return this.teamModel.find({}).exec();
  }

  async findOneByTag(tag: string) {
    const team = await this.teamModel.findOne({ tag }).exec();
    if (!team) {
      throw new NotFoundException();
    }
    return team;
  }

  findOne(id: string) {
    return this.teamModel.findById(id).populate('owner').exec();
  }

  async checkIfTeamExists(tag: string) {
    const team = await this.teamModel.findOne({ tag }).exec();
    if (!team) {
      return {
        exists: false,
      };
    }
    return {
      data: true,
    };
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
  }

  async inviteUser(inviter: string, inviteUserDto: InviteUserDto) {
    const user = await this.userService.findByUsername(inviteUserDto.username);

    const team = await this.teamModel
      .findOne({
        teamtag: inviteUserDto.teamtag,
      })
      .populate('owner');

    if (team.owner.username !== inviter) {
      throw new BadRequestException('You are not the owner');
    }

    if (!user || !team) {
      throw new BadRequestException('Team or User doesnt exists');
    }

    if (user.invites.includes(team) || team.invites.includes(user)) {
      throw new BadRequestException('Already invited');
    }

    await user.updateOne({ $push: { invites: team.tag } }).exec();
    await team
      .updateOne({ $push: { invites: user.username } }, { new: true })
      .exec();
    return team;
  }

  remove(id: string) {
    return this.teamModel.findByIdAndRemove(id).exec();
  }
}
