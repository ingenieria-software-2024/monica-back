import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' })
  /** El nombre representativo del producto a crear. */
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @Length(0, 500, {
    message: 'La descripción no puede superar los 500 caracteres.',
  })
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

  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  /** El ID de categoría o sub-categoría a la que pertenece este producto. */
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  @IsDefined()
  /** Indicador de si el ID provisto pertenece a una sub-categoría y no a una categoría común y corriente. */
  isSubCategory: boolean;
}
