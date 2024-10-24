import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    IsInt,
    IsPositive,
  } from 'class-validator';
  
  export class CreateVariantCategoryDto {
    @IsOptional() // El ID puede no ser necesario en una creación.
    @IsInt()
    @IsPositive()
    id?: number; // Agregar ID opcional si es necesario para la lógica

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string; // Descripción opcional para la categoría de variante
  }
  