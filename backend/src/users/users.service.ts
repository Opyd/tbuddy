import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';
import { TeamsService } from '../teams/teams.service';
import { TeamsModule } from '../teams/teams.module';
import { HandleInviteDto } from './dto/handle-invite.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => TeamsService))
    private teamService: TeamsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .select({ refreshToken: 0, password: 0, _v: 0 })
      .exec();
  }

  async findLoggedUser(username: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ username })
      .select({ refreshToken: 0, password: 0, _v: 0 })
      .exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .select({ refreshToken: 0, password: 0, _v: 0 });
  }

  async handleInvite(username: string, handleInviteDto: HandleInviteDto) {
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
          $push: { members: user.username },
          $pull: { invites: user.username },
        })
        .exec();
      await user
        .updateOne({ $pull: { invites: team.tag }, currentTeam: team.tag })
        .select({ refreshToken: 0, password: 0, _v: 0 })
        .exec();
    }
    //if user declines
    if (!handleInviteDto.decision) {
      team.updateOne({
        $pull: { invites: user.username },
      });
      await user.updateOne({ $pull: { invites: team.tag } }).exec();
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }

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

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
