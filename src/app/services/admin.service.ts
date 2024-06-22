import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/staff';


  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStaffs(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Failed to get staff list:', error);
        return throwError(() => new Error('Failed to get staff list, please try again later.'));
      })
    );
  }

  updateStaff(id: number, staff: Staff): Observable<Staff> {
    const headers = this.getAuthHeaders();
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff, { headers }).pipe(
      tap(() => console.log('Staff updated successfully')),
      catchError(error => {
        console.error('Failed to update staff:', error);
        return throwError(() => new Error('Failed to update staff, please try again later.'));
      })
    );
  }

  deleteStaffs(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log('Staff deleted successfully')),
      catchError(error => {
        console.error('Failed to delete staff:', error);
        return throwError(() => new Error('Failed to delete staff, please try again later.'));
      })
    );
  }
}
