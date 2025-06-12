export interface CartItem {
  /** El ID de variante de producto que representa este item. */
  productId: string;

  price: number;
  quantity: number;
  totalPrice: number;
}
