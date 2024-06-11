import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TeamEventsInterface, TeamHistoryInterface } from './team.interface';
import { TeamHistorySchema } from './team-history.schema';
import { TeamEventsHistorySchema } from './team-events-history.schema';
import { ApiProperty } from '@nestjs/swagger';

export type TeamDocument = Team & Document;

/**
 * @class Team
 */
@Schema({ timestamps: true, toObject: { virtuals: true, getters: true } })
export class Team {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ default: 'mdi-account-group' })
  icon: string;

  @ApiProperty()
  @Prop({ required: true, unique: true, minlength: 4, maxlength: 4 })
  tag: string;

  @ApiProperty()
  @Prop({ type: String, ref: 'User' })
  owner: string;

  @ApiProperty()
  @Prop({ type: [{ type: String, ref: 'User' }] })
  members: string[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'User' }] })
  invitedUsernames: string[];

  @ApiProperty()
  @Prop({ default: null })
  activeTournament: string;

  @ApiProperty()
  @Prop({ type: [{ type: TeamEventsHistorySchema }] })
  events: TeamEventsInterface[];

  @ApiProperty()
  @Prop({ type: [{ type: TeamHistorySchema }] })
  history: TeamHistoryInterface[];

  @ApiProperty()
  @Prop({ type: String })
  color: string;
}

const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.virtual('invitedUsers', {
  type: 'String',
  ref: 'User',
  localField: 'invitedUsernames',
  foreignField: 'username',
});

export { TeamSchema };
