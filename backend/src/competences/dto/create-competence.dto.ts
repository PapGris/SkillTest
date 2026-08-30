import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCompetenceDto {
  @IsString()
  @MaxLength(100)
  nomCompetence!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
