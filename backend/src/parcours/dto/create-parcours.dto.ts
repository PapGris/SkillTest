import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateParcoursDto {
  @IsString()
  @MaxLength(150)
  titre!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
