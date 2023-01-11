import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StageSchema } from './stage.schema';
import { StageInterface } from './stage.interface';

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: true })
export class Tournament {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: String, ref: 'User' })
  organizer: string;

  @Prop({ type: String, ref: 'Team' })
  participants: string[];

  @Prop({ type: [{ type: StageSchema }] })
  stages: StageInterface[];
}

const TournamentSchema = SchemaFactory.createForClass(Tournament);

export { TournamentSchema };
