import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnInit, OnDestroy {

  @Input() productId: number | undefined;
  isAdmin: boolean = false;
  private subscription: Subscription = Subscription.EMPTY;
  constructor(private authService: AuthService, private productService: ProductService) {}

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isAdmin = isLoggedIn && localStorage.getItem('userRole') === 'ADMIN';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Čišćenje pretplate
  }

  deleteProduct(): void {
    if (!this.productId) {
      alert('Product ID is not specified');
      return;
    }

    // Confirmation dialog before deletion
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId).pipe(
        catchError(error => {
          alert('Failed to delete product: ' + error.message);
          return of(null); // Handle the error and complete the observable stream
        })
      ).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          // Additional logic can be added here, such as redirecting or updating a list
        },
        error: (error) => alert('Error during deletion: ' + error.message)
      });
    }
  }


}

