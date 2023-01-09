import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ _id: false })
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
