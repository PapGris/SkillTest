import { IsInt, Max, Min } from 'class-validator';

/**
 * Auto-evaluation du niveau d'un utilisateur sur une competence.
 * Echelle 1 (debutant) a 5 (expert) - a valider/ajuster si besoin.
 */
export class SetNiveauDto {
  @IsInt()
  @Min(1)
  @Max(5)
  niveauEstime!: number;
}
