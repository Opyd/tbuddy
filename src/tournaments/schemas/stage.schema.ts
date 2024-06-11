import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Match, MatchSchema } from './match.schema';
import { MatchInterface } from './match.interface';
import { ApiProperty } from '@nestjs/swagger';

export type StageDocument = Stage & Document;

@Schema({ _id: false })
export class Stage {
  @ApiProperty()
  @Prop({ required: true })
  finished: boolean;
  @ApiProperty()
  @Prop({ required: true })
  stageNr: number;
  @ApiProperty()
  @Prop({ type: [{ type: MatchSchema }] })
  matches: Match[];
}

const StageSchema = SchemaFactory.createForClass(Stage);

export { StageSchema };
