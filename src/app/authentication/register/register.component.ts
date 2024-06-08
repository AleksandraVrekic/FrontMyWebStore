// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
  export class RegisterComponent {
    registerForm: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', Validators.required],
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          country: ['', Validators.required],
          zip: ['', Validators.required]
        })
      });
    }

    onSubmit() {
      if (this.registerForm.valid) {
        const { username, password, name, surname, email, phone, address } = this.registerForm.value;

        this.authService.register(username, password, name, surname, email, phone, address).subscribe(
          (response) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);  // Redirect to login or another appropriate route
          },
          (error) => {
            console.error('Registration failed:', error);
          }
        );
      } else {
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
  }
