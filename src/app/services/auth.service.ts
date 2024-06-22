import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRole());

  constructor(private http: HttpClient, private router: Router) {}

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get userRole$(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  public getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          this.saveTokenAndUserData(response.token, username, response.firstName, response.lastName, response.email, response.role, response.id);
          this.loggedIn.next(true); // Emit new login status
          this.userRoleSubject.next(response.role); // Emit new role
        }),
        catchError(this.handleError)
      );
  }

  saveTokenAndUserData(token: string, username: string, firstName: string, lastName: string, email: string, role: string, id: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  register(username: string, password: string, name: string, surname: string, email: string, phone: string, address: {street: string, city: string, country: string, zip: string}): Observable<any> {
    const registrationData = {
      username,
      password,
      name,
      surname,
      email,
      phone,
      street: address.street,
      city: address.city,
      country: address.country,
      zip: address.zip,
      userRole: 'CUSTOMER'
    };
    console.log('Sending registration data:', registrationData);
    return this.http.post(`${this.baseUrl}/register/customer`, registrationData, { responseType: 'json' });
  }

  registerStaff(staff: { userName: string; password: string; name: string; surname: string; email: string; position: string; role: string }): Observable<any> {
    const registrationData = {
      userName: staff.userName,
      password: staff.password,
      name: staff.name,
      surname: staff.surname,
      email: staff.email,
      position: staff.position,
      role: staff.role
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.http.post(`${this.baseUrl}/register/staff`, registrationData, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearToken();
    this.loggedIn.next(false);  // Emit new logout status
    this.userRoleSubject.next(null); // Emit role change
    this.router.navigate(['/products']); // Redirect to products page on logout
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getAccountDetails() {
    return {
      id: localStorage.getItem('userId')
    };
  }
}
