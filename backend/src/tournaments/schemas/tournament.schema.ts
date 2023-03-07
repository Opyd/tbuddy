import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Stage, StageSchema } from './stage.schema';

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: true })
export class Tournament {
  @ApiProperty()
  @Prop({ required: true })
  title: string;
  @ApiProperty()
  @Prop({ required: true, unique: true })
  slug: string;
  @ApiProperty()
  @Prop({ required: true })
  nrOfTeams: number;
  @ApiProperty()
  @Prop({ required: true, default: false })
  started: boolean;
  @ApiProperty()
  @Prop({ required: true, default: false })
  finished: boolean;
  @ApiProperty()
  @Prop()
  description: string;
  @ApiProperty()
  @Prop({ required: true, type: String, ref: 'User' })
  organizer: string;
  @ApiProperty()
  @Prop({ type: [{ type: String, ref: 'Team' }] })
  participants: string[];
  @ApiProperty()
  @Prop({ type: [{ type: StageSchema }] })
  stages: Stage[];
}

const TournamentSchema = SchemaFactory.createForClass(Tournament);

export { TournamentSchema };
