import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register-staff.component.html',
  styleUrls: ['./register-staff.component.scss']
})
export class RegisterStaffComponent {
 /* registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog // Dodajemo MatDialog servis za otvaranje dijaloga
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Submit button clicked');
    if (this.registerForm.valid) {
      const { username, password, firstName, lastName, email, position } = this.registerForm.value;
      console.log('Form is valid. Registration data:', this.registerForm.value);

      this.authService.registerStaff(username, password, firstName, lastName, email, position).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);  // Redirect to login or another appropriate route
        },
        (error) => {
          console.error('Registration failed:', error);
        }
      );
    } else {
      console.error('Form is not valid');
      this.markAllAsTouched(this.registerForm);
    }
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Dodajemo metod za otvaranje dijaloga za unos informacija o novom zaposlenom
  openStaffFormDialog(): void {
    const dialogRef = this.dialog.open(StaffFormComponent, {
      width: '400px', // Možete prilagoditi širinu dijaloga prema potrebi
      data: {} // Ovde možete proslediti podatke ako je potrebno
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }*/
}
