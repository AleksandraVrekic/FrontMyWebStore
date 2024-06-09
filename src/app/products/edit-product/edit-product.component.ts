import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  productId: number = 0;
  isAdmin: boolean = false;
  categories: Category[] = [];
  private authSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: [0, Validators.required],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.authSubscription = this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isAdmin = isLoggedIn && localStorage.getItem('userRole') === 'ADMIN';
    });

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.productForm.patchValue({ category: product.category });
      },
      error: (err) => {
        console.error('Failed to fetch product:', err);
        this.router.navigate(['/products']);
      }
    });

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Failed to fetch categories:', err)
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (!this.productId) {
      console.error('Product ID is not provided.');
      return;
    }
    if (this.productForm.valid && this.isAdmin) {
      console.log(this.productForm.value);
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          alert('Failed to update product: ' + err.message);
        }
      });
    } else {
      alert('You do not have permission to update this product.');
    }
  }
}
