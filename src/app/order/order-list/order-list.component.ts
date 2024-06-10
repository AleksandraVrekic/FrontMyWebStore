import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ORDER_STATUSES } from '../../models/order-statuses';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  displayedOrders: Order[] = [];
  orderStatuses = ORDER_STATUSES;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;

  // Search date property
  searchDate: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.authService.isAdmin()) {
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders;
        this.applyFilters();
      });
    } else {
      const customerId = Number(this.authService.getAccountDetails().id);
      this.orderService.getOrdersForCustomer(customerId).subscribe(orders => {
        this.orders = orders;
        this.applyFilters();
      });
    }
  }

  applyFilters(): void {
    let tempOrders = [...this.orders];

    // Apply date filtering
    if (this.searchDate) {
      const search = new Date(this.searchDate);
      tempOrders = tempOrders.filter(order => new Date(order.orderDate).toDateString() === search.toDateString());
    }

    this.filteredOrders = tempOrders;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedOrders = this.filteredOrders.slice(start, end);
  }

  // Utility function to format date to "MM dd yyyy"
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = date.getFullYear();

    return `${month} ${day} ${year}`;
  }

  // Method to display formatted order date
  displayOrderDate(order: Order): string {
    return this.formatDate(new Date(order.orderDate));
  }

  updateOrderStatus(orderId: number | null, event: Event): void {
    if (orderId === null) {
      console.error('Order ID is null');
      return;
    }

    const status = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, status).subscribe(
      (updatedOrder) => {
        const index = this.orders.findIndex(order => order.orderId === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.applyFilters();
        }
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }

  deleteOrder(orderId: number | null): void {
    if (orderId === null) {
      console.error('Order ID is null');
      return;
    }
    this.orderService.deleteOrder(orderId).subscribe(
      () => {
        this.orders = this.orders.filter(order => order.orderId !== orderId);
        this.applyFilters();
      },
      error => {
        console.error('Error deleting order:', error);
      }
    );
  }

  onDateChange(): void {
    this.currentPage = 1; // Reset to the first page whenever the date changes
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }
}
