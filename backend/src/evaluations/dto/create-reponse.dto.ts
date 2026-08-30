import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateReponseDto {
  @IsString()
  @MaxLength(255)
  texteReponse!: string;

  @IsBoolean()
  estCorrecte!: boolean;
}
