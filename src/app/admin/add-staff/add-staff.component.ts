import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent implements OnInit {
  addStaffForm: FormGroup;

  positions: string[] = ['Store Manager', 'Marketing Specialist', 'Inventory Manager', 'HR', 'Cashier', 'Support'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddStaffComponent>,
    private dialog: MatDialog
  ) {
    this.addStaffForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required]
    });
  }


  ngOnInit(): void {}

  save() {
    if (this.addStaffForm.valid) {
      const formValues = this.addStaffForm.value;
      const staffData = {
        userName: formValues.userName,
        password: formValues.password,
        name: formValues.name,
        surname: formValues.surname,
        email: formValues.email,
        position: formValues.position,
        role: 'ADMIN' // Set role to ADMIN programmatically
      };
      console.log('Staff data being sent:', staffData); // Debugging line
      this.authService.registerStaff(staffData).subscribe(() => {
        this.dialogRef.close(true);
      }, (error) => {
        console.error('Error registering staff:', error);
      });
    }
  }

/*
  save() {
    if (this.addStaffForm.valid) {
      this.authService.registerStaff(this.addStaffForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }*/

  close() {
    this.dialogRef.close();
  }
}
