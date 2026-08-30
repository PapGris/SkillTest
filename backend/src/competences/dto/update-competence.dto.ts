import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCompetenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nomCompetence?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
