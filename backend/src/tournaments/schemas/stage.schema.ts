import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Match, MatchSchema } from './match.schema';
import { MatchInterface } from './match.interface';

export type StageDocument = Stage & Document;

@Schema({ _id: false })
export class Stage {
  @Prop({ required: true })
  finished: boolean;

  @Prop({ required: true })
  stageNr: number;

  @Prop({ type: [{ type: MatchSchema }] })
  matches: Match[];
}

const StageSchema = SchemaFactory.createForClass(Stage);

export { StageSchema };
