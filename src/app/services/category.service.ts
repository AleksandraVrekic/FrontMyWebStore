import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { Product } from "../models/product-model";
import { Category } from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080'; // Ažurirajte prema vašem API
  private categoriesUpdated = new Subject<void>();

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategoryProducts(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`);
  }

  addCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post<Category>(`${this.apiUrl}/categories`, category, { headers }).pipe(
      tap(() => this.categoriesUpdated.next())
    );
  }

  updateCategory(categoryId: number, category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.put<Category>(`${this.apiUrl}/categories/${categoryId}`, category, { headers }).pipe(
      tap(() => this.categoriesUpdated.next())
    );
  }

  deleteCategory(categoryId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.delete<void>(`${this.apiUrl}/categories/${categoryId}`, { headers }).pipe(
      tap(() => this.categoriesUpdated.next())
    );
  }

  getCategoriesUpdateListener(): Observable<void> {
    return this.categoriesUpdated.asObservable();
  }
}
