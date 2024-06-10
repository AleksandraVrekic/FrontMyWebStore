import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { Product } from '../models/product-model';
import { CartService } from '../services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CheckoutComponent } from '../checkout/checkout.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSnackBarModule]
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total: number = 0;
  totalQuantity: number = 0;
  isLoggedIn: boolean = false;


  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.updateCartSummary();
    });

    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  updateCartSummary(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalQuantity = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  increaseQuantity(product: Product): void {
    const success = this.cartService.addToCart(product);
    if (!success) {
      this.snackBar.open('Cannot add more items than available in stock.', 'Close', {
        duration: 3000,
      });
    } else {
      this.updateCartSummary();
    }
  }

  decreaseQuantity(product: Product): void {
    const success = this.cartService.decreaseQuantity(product);
    if (!success) {
      this.snackBar.open('Cannot decrease quantity.', 'Close', {
        duration: 3000,
      });
    } else {
      this.updateCartSummary();
    }
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.updateCartSummary();
  }

  onPlati(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Your cart is empty.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (!this.isLoggedIn) {
      this.snackBar.open('You must be logged in to checkout.', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Navigacija na checkout stranicu
    this.router.navigate(['/checkout']);
  }
}


