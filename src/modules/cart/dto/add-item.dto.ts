import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Esta clase la use para definir la estructura de datos que se espara recibir cuando el cliente intente agregar un producto al carrito.
 */
export class AddItemDto {
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
