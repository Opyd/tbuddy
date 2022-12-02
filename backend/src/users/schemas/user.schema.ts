import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from '../../teams/schema/team.schema';

export type UserDocument = User & Document;

export enum PlayerRoles {
  MID = 'MID',
  TOP = 'TOP',
  JUNGLE = 'JUNGLE',
  BOT = 'BOT',
  SUPPORT = 'SUPPORT',
}

export enum UserRoles {
  PLAYER = 'PLAYER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export class UserDetails {
  firstname: string;
  country: string;
  avatar: string;
  about: string;
  prefferedRoles: PlayerRoles[];

  public constructor() {
    this.firstname = '';
    this.country = '';
    this.avatar = null;
    this.about = '';
    this.prefferedRoles = [];
  }
}

/**
 * @class User
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: UserRoles;

  @Prop()
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', defualt: null })
  currentTeam: Team;

  @Prop({ type: UserDetails, default: new UserDetails() })
  details: UserDetails;
}

export const UserSchema = SchemaFactory.createForClass(User);
