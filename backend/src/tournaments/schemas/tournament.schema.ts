import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Stage, StageSchema } from './stage.schema';

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: true })
export class Tournament {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  nrOfTeams: number;

  @Prop({ required: true, default: false })
  started: boolean;

  @Prop({ required: true, default: false })
  finished: boolean;

  @Prop()
  description: string;

  @Prop({ required: true, type: String, ref: 'User' })
  organizer: string;

  @Prop({ type: [{ type: String, ref: 'Team' }] })
  participants: string[];

  @Prop({ type: [{ type: StageSchema }] })
  stages: Stage[];
}

const TournamentSchema = SchemaFactory.createForClass(Tournament);

export { TournamentSchema };
