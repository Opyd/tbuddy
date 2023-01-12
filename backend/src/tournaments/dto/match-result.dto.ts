import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MatchResultDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stageNr: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  winner: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  result: string;
}
