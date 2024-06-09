import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule] // Add MatSnackBarModule here
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Login successful, token:', response.token);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 3000,
            });
          } else if (error.status === 500) {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 3000,
            });
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 3000,
            });
          }
        }
      );
    }
  }
}


