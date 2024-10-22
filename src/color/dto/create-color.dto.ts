import { IsInt, IsNotEmpty, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsInt()
  @Min(0) // Stock no puede ser negativo
  stock: number;

  @IsInt()
  @Min(0) // stockMin no puede ser negativo
  stockMin: number;
}
