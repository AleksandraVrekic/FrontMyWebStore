import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product-model';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';
  private productsChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.http.post<Product>(this.apiUrl, product, { headers }).pipe(
      tap(() => this.productsChanged.next()), // Emit change event
      catchError(error => {
        console.error('Failed to create product:', error);
        return throwError(() => new Error('Failed to create product, please try again later.'));
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers }).pipe(
      tap(() => this.productsChanged.next()) // Emit change event
    );
  }

  deleteProduct(productId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers }).pipe(
      tap(() => this.productsChanged.next()) // Emit change event
    );
  }

  searchProducts(productName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search`, {
      params: { product_name: productName }
    });
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductsChanged(): Observable<void> {
    return this.productsChanged.asObservable();
  }
}

