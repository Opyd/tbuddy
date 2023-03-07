import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Icon in format mdi-xxx',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    minimum: 4,
    maximum: 4,
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  tag: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  color: string;
}
