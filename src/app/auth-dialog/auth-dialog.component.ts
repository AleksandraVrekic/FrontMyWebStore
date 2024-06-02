import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatDialogModule]
})
export class AuthDialogComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  isLoggedIn = false;
  username: string | null = null;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<AuthDialogComponent>
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      addressId: ['', Validators.required]  // Make sure this is being input as a number
    });

  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.username = this.authService.getUsername();
      } else {
        this.username = null;
      }
    });
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Login successful, token:', response);
          // Correct method call with all needed data
          this.authService.saveTokenAndUserData(response.token, username, response.firstName, response.lastName, response.email, response.role, response.id);
          this.dialogRef.close();
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const { username, password, name, surname, email, phone, addressId } = this.registerForm.value;
      this.authService.register(username, password, name, surname, email, phone, addressId).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.dialogRef.close(); // Assuming dialogRef is correctly defined somewhere in your component
          this.router.navigate(['/login']); // Redirect to the login page
        },
        (error) => {
          console.error('Registration failed:', error);
        }
      );
    }
  }


  logout() {
    this.authService.logout();
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}
