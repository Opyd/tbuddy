import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mongoadmin:mongoadmin@localhost:27017/praca',
    ),
    UsersModule,
    AuthModule,
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
