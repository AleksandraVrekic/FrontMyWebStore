import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/staff';


  constructor(private http: HttpClient) {}

  getStaffs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(`${this.apiUrl}`, staff);
  }

  updateStaff(id: number, staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff);
  }

  deleteStaffs(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
