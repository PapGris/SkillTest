import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  enonce?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @IsOptional()
  @IsInt()
  competenceId?: number;
}
