import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateParcoursDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
