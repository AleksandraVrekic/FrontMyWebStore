import { Account } from "./account";
import { OrderItem } from "./order-item";

export class Order {
  orderId?: number;
  orderDate: Date;
  orderStatus: string;
  totalPrice: number;
  discount: number;
  account: Account;
  orderItems: OrderItem[];

  constructor(
    orderDate: Date,
    orderStatus: string,
    totalPrice: number,
    discount: number,
    account: Account,
    orderItems: OrderItem[]
  ) {
    this.orderDate = orderDate;
    this.orderStatus = orderStatus;
    this.totalPrice = totalPrice;
    this.discount = discount;
    this.account = account;
    this.orderItems = orderItems;
  }
}

