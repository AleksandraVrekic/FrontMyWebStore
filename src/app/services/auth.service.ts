import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          this.saveTokenAndUserData(response.token, username, response.firstName, response.lastName, response.email, response.role, response.Id);
          this.loggedIn.next(true);
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
    localStorage.setItem('userId', id);  // Dodavanje userId u localStorage
  }

  register(username: string, password: string, name: string, surname: string, email: string, phone: string, addressId: number): Observable<any> {
    const registrationData = {
      username,
      password,
      name,
      surname,
      email,
      phone,
      addressId,
      userRole: 'CUSTOMER' // Assuming role needs to be sent as well
    };
    console.log('Sending registration data:', registrationData);
    return this.http.post(`${this.baseUrl}/register/customer`, registrationData, { responseType: 'text' });
  }

  registerStaff(username: string, password: string, firstName: string, lastName: string, email: string, position: string): Observable<any> {
    const registrationData = {
      username,
      password,
      firstName,
      lastName,
      email,
      position
    };
    return this.http.post(`${this.baseUrl}/register/staff`, registrationData, { responseType: 'text' });
  }

  logout(): void {
    this.clearToken();
    this.loggedIn.next(false);  // Notify subscribers that user is logged out
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');  // Clearing userId when logging out
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getAccountDetails() {
    return {
      id: localStorage.getItem('userId') // Samo ID je potreban za narudžbinu
    };
  }
}



