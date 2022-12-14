import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
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

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
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
