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
  imports: [ReactiveFormsModule, CommonModule,]
})
export class EditProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  productId: number = 0; // Default value, not ideal if productId should always be provided
  isAdmin: boolean = false;
  categories: Category[] = [];
  private authSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: [0, Validators.required],
      categoryName: ['', Validators.required] // Add categoryId control
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
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to fetch product:', err);
        this.router.navigate(['/products']);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
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
      const selectedCategory = this.categories.find(cat => cat.categoryName === this.productForm.value.categoryName);
      const productData = {
        ...this.productForm.value,
        category: selectedCategory
      };

      this.productService.updateProduct(this.productId, productData).subscribe({
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
