import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';
import { UsersModule } from '../users/users.module';
import { TeamsModule } from '../teams/teams.module';
import { Match, MatchSchema } from './schemas/match.schema';
import { Stage, StageSchema } from './schemas/stage.schema';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentSchema },
    ]),

    UsersModule,
    TeamsModule,
  ],
  exports: [TournamentsService],
})
export class TournamentsModule {}
