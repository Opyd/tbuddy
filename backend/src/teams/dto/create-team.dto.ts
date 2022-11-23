import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  tag: string;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
