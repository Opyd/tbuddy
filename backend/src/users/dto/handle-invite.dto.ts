import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandleInviteDto {
  @ApiProperty({
    description: "Team's tag that sent the invite",
  })
  @IsString()
  @IsNotEmpty()
  teamtag: string;

  @ApiProperty({
    description: "User's decision",
  })
  @IsBoolean()
  @IsNotEmpty()
  decision: boolean;
}
