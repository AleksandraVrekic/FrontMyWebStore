// src/app/products/product-details/product-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product-model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],  // Only include standalone components, directives, and pipes here
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  backendUrl = 'http://localhost:8080'; // Bazni URL za backend server

  constructor(
    private route: ActivatedRoute,  // Correctly injected here
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar


  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];  // Get the id from the route parameters
      this.productService.getProductById(id).subscribe(product => {
        this.product = product;  // Set the product based on the fetched data
      });
    });
  }

  addToCart(product: Product): void {
    const success = this.cartService.addToCart(product);
    if (!success) {
      this.snackBar.open('Cannot add more items than available in stock.', 'Close', {
        duration: 3000,
      });
    }
  }

  canAddToCart(product: Product): boolean {
    const cartItem = this.cartService.getCartItemsValue().find(item => item.id === product.id);
    return cartItem ? cartItem.quantity < product.quantity : true;
  }

  getImageUrl(imagePath: string): string {
    return `${this.backendUrl}${imagePath}`;
  }
}
