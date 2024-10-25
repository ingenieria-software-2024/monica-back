import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';
import { UpdateVariantDto } from 'src/modules/stock/dto/update-variant.dto';
import { CreateVariantCategoryDto } from 'src/modules/category/variant/dto/create-variantCategory.dto';

export class CreateProductDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' })
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @Length(0, 500, {
    message: 'La descripción no puede superar los 500 caracteres.',
  })
  description?: string;

  @IsNumber()
  @IsDefined()
  @Min(0)
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  imageUrl: string;

  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  @IsDefined()
  isSubCategory: boolean;

  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  @IsOptional()
  variants?: UpdateVariantDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateVariantCategoryDto)
  @IsOptional()
  variantCategory?: CreateVariantCategoryDto;
}
