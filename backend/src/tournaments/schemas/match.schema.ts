import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema()
export class Match {
  @ApiProperty()
  @Prop({ type: String, ref: 'Team' })
  teamA: string;
  @ApiProperty()
  @Prop({ type: String, ref: 'Team' })
  teamB: string;
  @ApiProperty()
  @Prop({ type: String, ref: 'Team' })
  winner: string;
  @ApiProperty()
  @Prop()
  result: string;
  @ApiProperty()
  @Prop()
  finished: boolean;
}

const MatchSchema = SchemaFactory.createForClass(Match);

export { MatchSchema };
