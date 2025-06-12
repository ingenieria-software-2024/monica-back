import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  IsNumber,
  IsDefined,
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

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @IsDefined()
  /** El precio que tiene esta variante. */
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  /** Si es provista, una imágen representativa de esta variante de producto. */
  imageUrl?: string;

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
