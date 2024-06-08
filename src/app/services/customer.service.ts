import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/customers';

  constructor(private http: HttpClient) {}

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${customerId}`);
  }

  updateCustomer(customerId: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${customerId}`, customer);
  }
  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${customerId}`);
  }

  getUserProfileByUsername(username: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/username/${username}`);
  }

}
