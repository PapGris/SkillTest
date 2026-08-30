import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class ReponseInputDto {
  @IsString()
  @MaxLength(255)
  texteReponse!: string;

  @IsBoolean()
  estCorrecte!: boolean;
}
