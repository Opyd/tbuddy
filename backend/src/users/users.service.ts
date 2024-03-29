import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';
import { TeamsService } from '../teams/teams.service';
import { HandleInviteDto } from './dto/handle-invite.dto';
import { EventEnum } from '../teams/schema/team-events-history.schema';

/**
 * Collection of User specific action
 */
@Injectable()
export class UsersService {
  /**
   * Injecting dependencies and creating mongoose model
   * @param userModel {Model<UserDocument>}
   * @param teamService {TeamsService}
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => TeamsService))
    private teamService: TeamsService,
  ) {}

  /**
   * Creating new user
   * @param createUserDto {CreateUserDto}
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = await new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Returns all users
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .select({ refreshToken: 0, password: 0, _v: 0 })
      .exec();
  }

  /**
   * Returns logged user
   * @param username {String}
   */
  async findLoggedUser(username: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ username })
      .select({ refreshToken: 0, password: 0, _v: 0 })
      .exec();
  }

  /**
   * Returns specific user
   * @param id
   */
  async findOne(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .select({ refreshToken: 0, password: 0, _v: 0 });
  }

  /**
   * Removing message at index
   * @param index
   * @param username
   */
  async deleteMsgAtIndex(
    index: number,
    username: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new BadRequestException();
    }
    if (user.inbox.length - 1 < index) {
      throw new BadRequestException('Out of bounds index');
    }
    const position = 'inbox.' + index;
    await user.updateOne({ $unset: { [position]: 1 } });
    await user.updateOne({ $pull: { inbox: null } });
    return user;
  }

  /**
   * Allows user to reject/accept invite
   * @param username
   * @param handleInviteDto
   */
  async handleInvite(
    username: string,
    handleInviteDto: HandleInviteDto,
  ): Promise<UserDocument> {
    const user = await this.findByUsername(username);
    if (user.currentTeam !== null) {
      throw new BadRequestException('User already in team.');
    }
    const team = await this.teamService.findOneByTag(handleInviteDto.teamtag);
    if (!team) {
      throw new BadRequestException('Team doesnt exists');
    }
    //if user agrees
    if (handleInviteDto.decision) {
      await team
        .updateOne({
          $push: {
            members: user.username,
            events: {
              type: EventEnum.JOINED,
              date: Date.now(),
              msg: `${user.username} joined the team`,
            },
          },
          $pull: { invitedUsernames: user.username },
        })
        .exec();
      await user
        .updateOne({ $pull: { invitesTags: team.tag }, currentTeam: team.tag })
        .select({ refreshToken: 0, password: 0, _v: 0 })
        .exec();
    }
    //if user declines
    if (!handleInviteDto.decision) {
      await team.updateOne({
        $pull: { invitedUsernames: user.username },
      });
      await user.updateOne({ $pull: { invitesTags: team.tag } }).exec();
    }

    return user;
  }

  /**
   * Searches for specified user
   * @param username
   * @param populate
   */
  async findByUsername(
    username: string,
    populate?: boolean,
  ): Promise<UserDocument> {
    if (populate) {
      const user = await this.userModel
        .findOne({ username })
        .populate('invites')
        .exec();
      return user;
    }
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }

  /**
   * Searches for users
   * @param query
   * @param team
   */
  async findLikeUsername(
    query: string,
    team?: boolean,
  ): Promise<UserDocument[]> {
    return this.userModel
      .find({
        username: new RegExp('.*' + query + '.*', 'i'),
        currentTeam: team ? { $in: [null, new RegExp('.*')] } : null,
      })
      .select({ username: 1, 'details.preferredRoles': 1, avatar: 1 })
      .limit(10);
  }

  /**
   * Allows user to update his details
   * @param id
   * @param updateUserDto
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  /**
   * Update function for changes to account made by user
   * @param {string} username
   * @param {UserUpdateSelfDto} userUpdateSelfDto
   */
  async updateSelf(
    username: string,
    userUpdateSelfDto: UserUpdateSelfDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findOneAndUpdate({ username }, userUpdateSelfDto, { new: true })
      .select({ refreshToken: 0, password: 0, _v: 0 })
      .exec();
  }

  /**
   * Allows user to leave the team
   * @param reqUser
   */
  async leaveTeam(reqUser: Express.User): Promise<{ msg }> {
    const user = await this.userModel.findOne({
      username: reqUser['username'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.currentTeam === null) {
      throw new BadRequestException('User not in team');
    }
    const team = await this.teamService.findOneByTag(user.currentTeam);
    if (!team) {
      throw new BadRequestException("Team doesn't exists");
    }
    if (team.activeTournament !== null) {
      throw new BadRequestException('Team is participating in tournament');
    }
    if (user.username === team.owner) {
      throw new BadRequestException('You cant leave your own team');
    }
    team.members = team.members.filter((member) => member !== user.username);
    team.events.push({
      type: EventEnum.LEFT,
      date: new Date(),
      msg: `${user.username} left the team`,
    });
    user.currentTeam = null;
    await team.save();
    await user.save();
    return { msg: 'Successfully left the team' };
  }
}
