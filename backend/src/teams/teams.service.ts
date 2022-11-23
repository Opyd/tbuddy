import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './schema/team.schema';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}
  create(createTeamDto: CreateTeamDto) {
    return new this.teamModel(createTeamDto).save();
  }

  findAll() {
    return this.teamModel.find({}).exec();
  }

  findOne(id: string) {
    return this.teamModel.findById(id).populate('owner').exec();
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.teamModel.findByIdAndRemove(id).exec();
  }
}
