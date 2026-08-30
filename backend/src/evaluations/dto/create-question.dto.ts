import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ReponseInputDto } from './reponse-input.dto.js';

export class CreateQuestionDto {
  @IsString()
  enonce!: string;

  @IsInt()
  @Min(1)
  points!: number;

  @IsOptional()
  @IsInt()
  competenceId?: number;

  @IsArray()
  @ArrayMinSize(2, { message: 'Une question doit avoir au moins 2 reponses possibles' })
  @ValidateNested({ each: true })
  @Type(() => ReponseInputDto)
  reponses!: ReponseInputDto[];
}
