//esto lo uso para definir los datos que se espera cuando el cliente quiere actualizar la cantidad de un productoS

import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
