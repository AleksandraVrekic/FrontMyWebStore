export class CartItem {
  productId: string;
  quantity: number;
  price: number;  // Dodavanje cene proizvoda

  constructor(productId?: string, quantity?: number, price?: number) {
    this.productId = productId || '';
    this.quantity = quantity || 0;
    this.price = price || 0;
  }
}
