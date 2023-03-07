import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Team } from '../../teams/schema/team.schema';
import { UserDetails } from './user-details';

export type UserDocument = User & Document;

export enum UserRoles {
  PLAYER = 'PLAYER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

/**
 * @class User
 */
@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;
  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;
  @ApiProperty()
  @Prop({ default: null })
  avatar: string;
  @ApiProperty()
  @Prop({ required: true })
  password: string;
  @ApiProperty()
  @Prop({ required: true })
  role: UserRoles;
  @ApiProperty()
  @Prop()
  refreshToken: string;
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String, ref: 'Team', defualt: null })
  currentTeam: string;
  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'Team' }] })
  invitesTags: Team[];
  @ApiProperty()
  @Prop()
  inbox: string[];
  @ApiProperty()
  @Prop({ type: UserDetails, default: new UserDetails() })
  details: UserDetails;
}
const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
