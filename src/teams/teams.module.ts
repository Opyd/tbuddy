import { forwardRef, Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    forwardRef(() => UsersModule),
  ],
})
export class TeamsModule {}
