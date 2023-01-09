import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TeamEventsInterface, TeamHistoryInterface } from './team.interface';
import { TeamHistorySchema } from './team-history.schema';
import { TeamEventsHistorySchema } from './team-events-history.schema';

export type TeamDocument = Team & Document;

/**
 * @class Team
 */
@Schema({ timestamps: true, toObject: { virtuals: true, getters: true } })
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'mdi-account-group' })
  icon: string;

  @Prop({ required: true, unique: true, minlength: 4, maxlength: 4 })
  tag: string;

  @Prop({ type: String, ref: 'User' })
  owner: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  members: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'User' }] })
  invitedUsernames: string[];

  @Prop({ default: null })
  activeTournament: string;

  @Prop({ type: [{ type: TeamEventsHistorySchema }] })
  events: TeamEventsInterface[];

  @Prop({ type: [{ type: TeamHistorySchema }] })
  history: TeamHistoryInterface[];

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
