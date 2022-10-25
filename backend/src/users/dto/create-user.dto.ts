import {
  IsDefined,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PlayerRoles, UserDetails, UserRoles } from '../schemas/user.schema';
import { Type } from 'class-transformer';

class DetailsDto {
  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsEnum(PlayerRoles, { each: true })
  prefferedRoles: PlayerRoles[];
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  refreshToken: string;

  @IsEmpty()
  role: UserRoles;

  @IsOptional()
  @IsDefined()
  @Type(() => DetailsDto)
  @ValidateNested()
  details: DetailsDto;
}
