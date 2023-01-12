import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema()
export class Match {
  @Prop({ type: String, ref: 'Team' })
  teamA: string;

  @Prop({ type: String, ref: 'Team' })
  teamB: string;

  @Prop({ type: String, ref: 'Team' })
  winner: string;

  @Prop()
  result: string;

  @Prop()
  finished: boolean;
}

const MatchSchema = SchemaFactory.createForClass(Match);

export { MatchSchema };
