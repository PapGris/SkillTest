import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEvaluationDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  titre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  typeEvaluation?: string;
}
