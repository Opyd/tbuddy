import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

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

interface TeamHistoryInterface {
  matchId: string;
  oponnent: string;
  oponnentId: string;
  result: string;
  date: Date;
}

export const TeamHistorySchema = SchemaFactory.createForClass(TeamHistory);

/**
 * @class Team
 */

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'mdi-account-group' })
  icon: string;

  @Prop({ required: true, unique: true, minlength: 4, maxlength: 4 })
  tag: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({
    type: [{ type: String, ref: 'User' }],
    default: null,
  })
  invites: User[];

  @Prop({ default: null })
  activeTournament: string;

  @Prop({ type: [{ type: TeamHistorySchema }] })
  history: TeamHistoryInterface[];

  @Prop({ type: String })
  color: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
