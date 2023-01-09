import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TeamHistoryInterface } from './team.interface';

export type TeamDocument = Team & Document;

@Schema()
export class TeamHistory extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId /* TODO: ref: History */,
  })
  matchId: string;
  @Prop({ required: true })
  oponnent: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
  oponnentId: string;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  date: Date;
}

export const TeamHistorySchema = SchemaFactory.createForClass(TeamHistory);

/**
 * @class Team
 */

@Schema({ timestamps: true, toObject: { virtuals: true, getters: true } })
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'mdi-account-group' })
  icon: string;

  @Prop({ required: true, unique: true, minlength: 4, maxlength: 4 })
  tag: string;

  @Prop({ type: String, ref: 'User' })
  owner: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  members: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'User' }] })
  invitedUsernames: string[];

  @Prop({ default: null })
  activeTournament: string;

  @Prop({ type: [{ type: TeamHistorySchema }] })
  history: TeamHistoryInterface[];

  @Prop({ type: String })
  color: string;
}

const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.virtual('invitedUsers', {
  type: 'String',
  ref: 'User',
  localField: 'invitedUsernames',
  foreignField: 'username',
});

export { TeamSchema };
