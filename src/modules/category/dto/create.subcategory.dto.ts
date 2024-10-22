import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  /** El nombre de la subcategoria a crear. */
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  /** Una descripcion asociada a esta subcategoria. */
  description?: string;
}
