import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateVariantDto {
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

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  variantCategoryId: number;
}
