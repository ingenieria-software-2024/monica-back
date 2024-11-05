import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVariantCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string; // Campo opcional para actualizar el nombre

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string; // Campo opcional para actualizar la descripción

  @IsOptional()
  @IsInt()
  id?: number; // Si decides pasar el ID para asegurar que se está actualizando la categoría correcta
}
