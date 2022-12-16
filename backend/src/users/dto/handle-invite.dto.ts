import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandleInviteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teamtag: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  decision: boolean;
}
