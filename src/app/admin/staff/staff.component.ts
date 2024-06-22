import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Staff } from '../../models/staff.model';
import { CommonModule } from '@angular/common';
import { EditStaffComponent } from '../edit-staff/edit-staff.component';
import { MatDialog } from '@angular/material/dialog';
import { AddStaffComponent } from '../add-staff/add-staff.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit, OnDestroy {
  staffs: Staff[] = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  private roleSubscription: Subscription | null = null; // Initialize with null
  private authSubscription: Subscription | null = null; // Initialize with null

  constructor(private authService: AuthService, private dialog: MatDialog, private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.roleSubscription = this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'ADMIN';
      this.isSuperAdmin = role === 'SUPER_ADMIN';
      if (!this.isAdmin && !this.isSuperAdmin) {
        this.router.navigate(['/products']); // Redirect to products page if not admin or super admin
      }
    });

    this.authSubscription = this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/products']); // Redirect to products page if logged out
      }
    });

    this.loadStaffs();
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadStaffs(): void {
    if (this.isAdmin || this.isSuperAdmin) {
      this.adminService.getStaffs().subscribe(data => {
        this.staffs = data;
      });
    }
  }


  addStaff(): void {
    const dialogRef = this.dialog.open(AddStaffComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStaffs();
      }
    });
  }

  editStaff(staff: Staff): void {
    const dialogRef = this.dialog.open(EditStaffComponent, {
      width: '500px',
      data: { staff }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStaffs();
      }
    });
  }

  deleteStaff(id: number): void {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.adminService.deleteStaffs(id).subscribe(() => {
        this.loadStaffs();
      });
    }
  }
}
