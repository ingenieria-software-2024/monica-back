import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  /** El nombre representativo del producto a crear. */
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  /** Una descripción asociada a este producto. */
  description?: string;

  @IsNumber()
  @IsDefined()
  @Min(0)
  /** El precio del producto a crear. */
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  /** La URL a una imágen representativa del producto. */
  imageUrl: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  /** El ID de categoría o sub-categoría a la que pertenece este producto. */
  categoryId: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsDefined()
  /** Indicador de si el ID provisto pertenece a una sub-categoría y no a una categoría común y corriente. */
  isSubCategory: boolean;
}
