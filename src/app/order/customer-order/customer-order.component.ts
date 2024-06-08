import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-order.component.html',
  styleUrl: './customer-order.component.css'
})
export class CustomerOrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit(): void {
    const accountId = Number(this.authService.getAccountDetails().id);
    this.orderService.getCustomerOrders(accountId).subscribe(
      orders => {
        this.orders = orders;
      },
      error => {
        console.error('Error fetching customer orders:', error);
      }
    );
  }


  displayOrderDate(order: Order): string {
    const date = new Date(order.orderDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  }
}
