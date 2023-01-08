import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserRoles } from '../schemas/user.schema';
import { Type } from 'class-transformer';
import { ApiHideProperty, ApiProduces, ApiProperty } from '@nestjs/swagger';
import { PlayerRoles } from '../schemas/user-details';

export class DetailsDto {
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
  preferredRoles: PlayerRoles[];

  @IsOptional()
  @IsBoolean()
  lookingForTeam: boolean;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiHideProperty()
  @IsEmpty()
  refreshToken: string;

  @ApiProperty()
  @IsEmpty()
  currentTeam: string;

  @ApiHideProperty()
  @IsEmpty()
  role: UserRoles;

  @ApiProperty({ type: DetailsDto })
  @IsOptional()
  @IsDefined()
  @Type(() => DetailsDto)
  @ValidateNested()
  details?: DetailsDto;
}
