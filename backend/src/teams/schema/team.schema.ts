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

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop()
  icon: string;

  @Prop({ required: true, unique: true })
  tag: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'User' })
  owner: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'User' }] })
  members: User[];

  @Prop({ default: null })
  activeTournament: string;

  @Prop({ type: [{ type: TeamHistorySchema }] })
  history: TeamHistoryInterface[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
