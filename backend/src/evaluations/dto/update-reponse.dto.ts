import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReponseDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  texteReponse?: string;

  @IsOptional()
  @IsBoolean()
  estCorrecte?: boolean;
}
