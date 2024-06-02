import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../models/product-model';
import { CartService } from '../services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total: number = 0;
  totalQuantity: number = 0;

  constructor(
    private cartService: CartService,
    //private stripeService: StripeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.updateCartSummary();
    });
  }

  updateCartSummary(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalQuantity = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  increaseQuantity(product: Product): void {
    this.cartService.addToCart(product);
    this.updateCartSummary();
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.updateCartSummary();
  }
  /*
  onPlati(): void {
    console.log(this.dialog);
    const dialogRef = this.dialog.open(CheckoutComponent, {
      width: '400px',
      data: { total: this.total }  // Pass the total amount to the Stripe checkout
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }*/
}
