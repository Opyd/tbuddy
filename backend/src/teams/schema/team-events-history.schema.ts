import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @Prop({ required: true, types: EventEnum })
  type: EventEnum;
  @ApiProperty()
  @Prop()
  date: Date;
  @ApiProperty()
  @Prop()
  msg: string;
}

export const TeamEventsHistorySchema =
  SchemaFactory.createForClass(TeamEventsHistory);
