import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentSchema },
    ]),
  ],
  exports: [TournamentsService],
})
export class TournamentsModule {}
