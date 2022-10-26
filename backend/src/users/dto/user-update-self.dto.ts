import { Injectable } from '@nestjs/common';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetailsDto } from './create-user.dto';

@Injectable()
export class UserUpdateSelfDto {
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsDefined()
  @Type(() => DetailsDto)
  @ValidateNested()
  details: DetailsDto;
}
