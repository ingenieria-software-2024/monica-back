//esta clase la use para definir la estructura de datos que se espara recibir cuando el cliente intente agregar un producto al carrito

export class AddItemDto {
  productId: string;
  price: number;
  quantity: number;
}
