import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRole());

  constructor(private http: HttpClient,private router: Router) {}

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
          this.saveTokenAndUserData(response.token, username, response.firstName, response.lastName, response.email, response.role, response.Id);
          this.loggedIn.next(true);
          this.userRoleSubject.next(response.role); // Notify about role change
        })
      );
  }

  saveTokenAndUserData(token: string, username: string, firstName: string, lastName: string, email: string, role: string, id: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id);  // Add userId to localStorage
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
      userRole: 'CUSTOMER' // Assuming role needs to be sent as well
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
      role: staff.role // Set role to ADMIN programmatically
    };
    return this.http.post(`${this.baseUrl}/register/staff`, registrationData, { responseType: 'text' });
  }

  logout(): void {
    this.clearToken();
    this.loggedIn.next(false);  // Notify subscribers that user is logged out
    this.userRoleSubject.next(null); // Notify about role change
    this.router.navigate(['/products']); // Redirect to products page on logout
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');  // Clear userId when logging out
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getAccountDetails() {
    return {
      id: localStorage.getItem('userId') // Only ID is needed for order
    };
  }

}
