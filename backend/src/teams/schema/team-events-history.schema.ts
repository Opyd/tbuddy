import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum EventEnum {
  CREATED = 'CREATED',
  JOINED = 'JOINED',

  TOURNAMENT_WIN = 'TOURNAMENT_WIN',

  TOURNAMENT_DROPPED = 'TOURNAMENT_DROPPED',

  LEFT = 'LEFT',
}

@Schema({ _id: false })
export class TeamEventsHistory extends Document {
  @Prop({ required: true, types: EventEnum })
  type: EventEnum;

  @Prop()
  date: Date;

  @Prop()
  msg: string;
}

export const TeamEventsHistorySchema =
  SchemaFactory.createForClass(TeamEventsHistory);
