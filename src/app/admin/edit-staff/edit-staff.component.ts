import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { Staff } from '../../models/staff.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-staff.component.html',
  styleUrl: './edit-staff.component.css'
})
export class EditStaffComponent implements OnInit {

  editStaffForm: FormGroup;
  positions: string[] = ['Store Manager', 'Marketing Specialist', 'Inventory Manager', 'HR', 'Cashier', 'Support'];
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<EditStaffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )  {
    this.editStaffForm = this.fb.group({
      userName: [data.staff.account.userName, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      position: [data.staff.position, Validators.required],
      firstName: [data.staff.account.firstName, Validators.required],
      lastName: [data.staff.account.lastName, Validators.required],
      email: [data.staff.account.email, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.editStaffForm.valid) {
      const formValues = this.editStaffForm.value;
      const staffData: Staff = {
        id: this.data.staff.id,
        position: formValues.position,
        account: {
          userName: formValues.userName,
          password: formValues.password,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          userRole: this.data.staff.account.userRole // Assuming this is available
        }
      };
      console.log('Staff data being sent:', staffData); // Debugging line
      this.adminService.updateStaff(this.data.staff.id, staffData).subscribe(() => {
        this.dialogRef.close(true);
      }, (error) => {
        console.error('Error updating staff:', error);
        this.errorMessage = error.error || 'An unexpected error occurred';
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
