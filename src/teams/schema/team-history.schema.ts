import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema({ _id: false })
export class TeamHistory extends Document {
  @ApiProperty()
  @Prop()
  matchId: string;

  @ApiProperty()
  @Prop({ required: true })
  opponent: string;

  @ApiProperty()
  @Prop({ required: true })
  result: string;

  @ApiProperty()
  @Prop({ required: true })
  date: Date;
}

export const TeamHistorySchema = SchemaFactory.createForClass(TeamHistory);
