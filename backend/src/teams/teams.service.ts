import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { UsersModule } from '../users/users.module';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const user = await this.userService.findByUsername(createTeamDto.owner);
    const team = await new this.teamModel(createTeamDto).save();
    await user.updateOne({ currentTeam: team.tag }).exec();
    return team;
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

  async isTeamOwnedByUser(userId: string) {
    const team = await this.teamModel.find({ owner: userId });
    if (!team) {
      return false;
    }
    return true;
  }

  async checkIfTeamExists(tag: string) {
    const team = await this.teamModel.findOne({ tag }).exec();

    return {
      exists: !!team,
    };
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
  }

  async removeUserFromTeam(owner: string, username: string) {
    const team = await this.teamModel.findOne({ owner: owner });
    const user = await this.userService.findByUsername(username);
    if (!team || !user) {
      throw new BadRequestException('Not Found');
    }
    console.log(user.currentTeam);
    console.log(team);
    if (user.currentTeam !== team.tag) {
      throw new BadRequestException('User is not in team');
    }
    await team.updateOne({ $pull: { members: user.username } }).exec();
    await user.updateOne({ currentTeam: null });
    return team;
  }

  async inviteUser(inviter: string, inviteUserDto: InviteUserDto) {
    const user = await this.userService.findByUsername(inviteUserDto.username);

    const team = await this.teamModel.findOne({
      teamtag: inviteUserDto.teamtag,
    });

    if (team.owner.toString() !== inviter) {
      throw new BadRequestException('You are not the owner');
    }

    if (!user || !team) {
      throw new BadRequestException('Team or User doesnt exists');
    }
    const userInvites = JSON.stringify(user.invitesTags);
    const usersInvitedByTeam = JSON.stringify(team.invitedUsernames);

    if (
      userInvites.includes(team.tag) ||
      usersInvitedByTeam.includes(user.username)
    ) {
      throw new BadRequestException('Already invited');
    }

    await user
      .updateOne({
        $push: {
          invitesTags: team.tag,
          inbox: `You have been removed from ${team.tag}`,
        },
      })
      .exec();
    return await team
      .updateOne({ $push: { invitedUsernames: user.username } }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.teamModel.findByIdAndRemove(id).exec();
  }
}
