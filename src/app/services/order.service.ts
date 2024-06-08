import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';
import { PaymentInfo } from '../models/payment-info';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders'; // Dodajte punu URL adresu

  private paymentIntentUrl = environment.apiUrl + '/orders/payment-intent';

  private ordersChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  getOrdersForCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo, { headers }).pipe(
      catchError(error => {
        console.error('Failed to create payment intent:', error);
        return throwError(() => new Error('Failed to create payment intent, please try again later.'));
      })
    );
  }
  /*
  getAllOrders(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.get(`${this.baseUrl}`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch orders:', error);
        return throwError(() => new Error('Failed to fetch orders, please try again later.'));
      })
    );*/


  getOrderById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error(`Failed to fetch order with id ${id}:`, error);
        return throwError(() => new Error('Failed to fetch order, please try again later.'));
      })
    );
  }

  createOrder(order: Order): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post(this.baseUrl, order, { headers }).pipe(
      tap(() => this.ordersChanged.next()), // Emit change event
      catchError(error => {
        console.error('Failed to create order:', error);
        console.error('Full error response:', error); // Loguje puni odgovor greške
        return throwError(() => new Error('Failed to create order, please try again later.'));
      })
    );
  }

  updateOrder(id: number, orderDetails: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.put(`${this.baseUrl}/${id}`, orderDetails, { headers }).pipe(
      tap(() => this.ordersChanged.next()), // Emit change event
      catchError(error => {
        console.error(`Failed to update order with id ${id}:`, error);
        return throwError(() => new Error('Failed to update order, please try again later.'));
      })
    );
  }

  deleteOrder(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { headers }).pipe(
      tap(() => this.ordersChanged.next()), // Emit change event
      catchError(error => {
        console.error(`Failed to delete order with id ${id}:`, error);
        return throwError(() => new Error('Failed to delete order, please try again later.'));
      })
    );
  }

  getOrdersChanged(): Observable<void> {
    return this.ordersChanged.asObservable();
  }

    // Method to update the status of an order
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/status`, { status });
  }

  getCustomerOrders(accountId: number): Observable<Order[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.get<Order[]>(`${this.baseUrl}/customer/${accountId}`, { headers });
  }
}


