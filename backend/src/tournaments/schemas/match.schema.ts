import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ _id: false })
export class Match {
  @Prop({ required: true, type: String, ref: 'Team' })
  teamA: string;

  @Prop({ required: true, type: String, ref: 'Team' })
  teamB: string;

  @Prop({ required: true, type: String, ref: 'Team' })
  winner: string;

  @Prop()
  result: string;
}

const MatchSchema = SchemaFactory.createForClass(Match);

export { MatchSchema };
