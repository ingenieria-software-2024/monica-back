import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Esta clase la uso para definir los datos que se espera cuando el cliente quiere actualizar la cantidad de un producto.
 */
export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
