import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatDialogModule, MatIconModule]
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
    public cartService: CartService,
    private router: Router,
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    private snackBar: MatSnackBar
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
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zip: ['', Validators.required]
      })
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
          this.authService.saveTokenAndUserData(response.token, username, response.firstName, response.lastName, response.email, response.role, response.id);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close();
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error);
          this.snackBar.open('Invalid username or password', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const { username, password, name, surname, email, phone, address } = this.registerForm.value;
      this.authService.register(username, password, name, surname, email, phone, address).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
          });
          console.log('Registration successful:', response);
          this.snackBar.open('Registration successful! Please log in.', 'Close', {
            duration: 3000,
          });
          this.isLoginMode = true; // Switch to login mode
        },
        (error: HttpErrorResponse) => {
          console.error('Registration failed:', error);
          if (error.status === 409 && (error.error === "Username already exists!" || error.error === "Email already exists!")) {
            this.snackBar.open(error.error, 'Close', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
    }
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart(); // Očistite korpu prilikom odjave
    this.dialogRef.close();
    this.router.navigate(['/products']); // Redirect to the products page after logout
    this.snackBar.open('You have been logged out.', 'Close', {
      duration: 3000,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
