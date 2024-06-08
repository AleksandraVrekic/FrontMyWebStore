import { Account } from "./account";
import { OrderItem } from "./order-item";

export class Order {
  orderId: number | null;
  orderDate: Date;
  orderStatus: string;
  totalPrice: number;
  discount: number;
  account: Account;
  orderItems: OrderItem[];

  constructor(
    orderId: number | null,
    orderDate: Date,
    orderStatus: string,
    totalPrice: number,
    discount: number,
    account: Account,
    orderItems: OrderItem[]
  ) {
    this.orderId = orderId;
    this.orderDate = orderDate;
    this.orderStatus = orderStatus;
    this.totalPrice = totalPrice;
    this.discount = discount;
    this.account = account;
    this.orderItems = orderItems;
  }
}
