import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt, ValidateNested } from 'class-validator';

export class ReponseDonneeInputDto {
  @IsInt()
  questionId!: number;

  /** Ids des reponses cochees par l'utilisateur pour cette question (peut etre vide = non repondue) */
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  reponseIds!: number[];
}

export class PasserEvaluationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReponseDonneeInputDto)
  reponses!: ReponseDonneeInputDto[];
}
