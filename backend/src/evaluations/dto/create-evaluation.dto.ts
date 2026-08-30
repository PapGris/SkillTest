import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateEvaluationDto {
  @IsInt()
  parcoursId!: number;

  @IsString()
  @MaxLength(150)
  titre!: string;

  /** Ex: "Quiz", "Simulation" (libre pour l'instant, a restreindre a une enum si besoin) */
  @IsString()
  @MaxLength(50)
  typeEvaluation!: string;
}
