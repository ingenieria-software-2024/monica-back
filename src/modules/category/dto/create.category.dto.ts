import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  /** El nombre de la categoria a crear. */
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  /** Una descripcion asociada a esta categoria. */
  description?: string;
}
