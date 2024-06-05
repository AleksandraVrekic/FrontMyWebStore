import { CartItem } from "./cart-item";

export class PaymentInfo {
  amount: number;
  currency: string;
  items: CartItem[];
  customerEmail: string;

  constructor(amount?: number, currency?: string, items?: CartItem[], customerEmail?: string) {
    this.amount = amount || 0;
    this.currency = currency || '';
    this.items = items || [];
    this.customerEmail = customerEmail || '';
  }
}

