import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ _id: false })
export class TeamHistory extends Document {
  @Prop()
  matchId: string;

  @Prop({ required: true })
  opponent: string;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  date: Date;
}

export const TeamHistorySchema = SchemaFactory.createForClass(TeamHistory);
