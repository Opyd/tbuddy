import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class KickFromTournamentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teamtag: string;
}
