import { IsNotEmpty, IsString } from 'class-validator';

export class KickFromTournamentDto {
  @IsString()
  @IsNotEmpty()
  teamtag: string;
}
