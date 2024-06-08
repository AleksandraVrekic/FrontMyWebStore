import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoggedIn$: Observable<boolean>;

  isAdmin: boolean = false;
  private roleSubscription: Subscription | undefined;

  constructor(private router: Router, private dialog: MatDialog,private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  ngOnInit() {
    this.roleSubscription = this.authService.userRole$.subscribe(role => {
      this.isAdmin = (role === 'ADMIN');
    });
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }


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

  openAddStaffDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '400px',
      data: {}
    });
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']); // Nova metoda za navigaciju na Admin rutu
  }

  title = 'my-web-shop';

  navigateToStaff() {
    this.router.navigate(['/admin/staff']);
  }

  navigateToProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate([`/profile`, userId]);
    }
  }

  navigateToOrders(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/orders']);
    } else {
      this.router.navigate(['/customer/orders']);
    }
  }
}
