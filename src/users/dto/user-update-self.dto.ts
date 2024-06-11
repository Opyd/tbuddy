import { Injectable } from '@nestjs/common';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetailsDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class UserUpdateSelfDto {
  @ApiProperty({
    description: "User's new password",
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsDefined()
  @Type(() => DetailsDto)
  @ValidateNested()
  details: DetailsDto;
}
