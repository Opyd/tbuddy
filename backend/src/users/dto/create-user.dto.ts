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
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  firstname: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  about: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(PlayerRoles, { each: true })
  preferredRoles: PlayerRoles[];

  @ApiProperty({
    required: false,
  })
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

  @ApiProperty({
    description: "Base64 representation of user's avatar",
  })
  @IsString()
  avatar: string;

  @ApiHideProperty()
  @IsEmpty()
  refreshToken: string;

  @ApiProperty({
    description: "User's current team tag",
    default: null,
  })
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
