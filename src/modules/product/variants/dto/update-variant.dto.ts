import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0) // Stock no puede ser negativo
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0) // stockMin no puede ser negativo
  stockMin?: number;
}
