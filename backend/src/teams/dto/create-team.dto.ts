import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  @Length(4, 4)
  tag: string;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
