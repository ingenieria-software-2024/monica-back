import { IsInt, IsOptional, IsString, Min, IsNotEmpty, IsDefined } from 'class-validator';

export class UpdateVariantDto {
  @IsInt()
  @IsDefined()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0) // Stock no puede ser negativo
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0) // stockMin no puede ser negativo
  stockMin?: number;

  @IsInt() 
  @IsNotEmpty() 
  productId: number; 

  @IsInt() 
  @IsNotEmpty() 
  variantCategoryId: number;
}
