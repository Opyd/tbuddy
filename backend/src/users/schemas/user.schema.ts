import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
@Schema({ timestamps: true, toObject: { virtuals: true, getters: true } })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: UserRoles;

  @Prop()
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'Team', defualt: null })
  currentTeam: Team;

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'Team' }] })
  invitesTags: Team[];

  @Prop()
  inbox: string[];

  @Prop({ type: UserDetails, default: new UserDetails() })
  details: UserDetails;
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('invites', {
  type: 'String',
  ref: 'Team',
  localField: 'invitesTags',
  foreignField: 'tag',
});

export { UserSchema };
