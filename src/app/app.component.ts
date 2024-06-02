import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private dialog: MatDialog,) {}

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }
  navigateToRegister() {
    this.router.navigate(['auth/register']);
  }

  openAuthDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      width: '300px',
      disableClose: true,
      autoFocus: true
    });
  }

  openCartDialog() {
    this.dialog.open(CartComponent, {
      width: '400px'
    });
  }

  title = 'my-web-shop';
}
