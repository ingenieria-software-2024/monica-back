//esta clase la use para definir la estructura de datos que se espara recibir cuando el cliente intente agregar un producto al carrito

import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
