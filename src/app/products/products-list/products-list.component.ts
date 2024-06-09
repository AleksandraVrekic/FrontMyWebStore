import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product-model';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { AddProductComponent } from '../add-product/add-product.component';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { DeleteCategoryComponent } from '../../category/delete-category/delete-category.component';
import { EditCategoryComponent } from '../../category/edit-category/edit-category.component';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule,    MatSnackBarModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  private productsSubscription!: Subscription;
  private productsChangedSubscription!: Subscription;
  searchForm: FormGroup;
  backendUrl = 'http://localhost:8080'; // Bazni URL za backend server

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      productName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadCategories();

    this.productsSubscription = this.searchForm.get('productName')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value !== null),
      switchMap(value => this.productService.searchProducts(value as string))
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.paginateProducts();
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
      }
    });

    this.productsChangedSubscription = this.productService.getProductsChanged().subscribe(() => {
      this.loadAllProducts();
    });

    this.categoryService.getCategoriesUpdateListener().subscribe(() => {
      this.loadCategories();
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.productsChangedSubscription) {
      this.productsChangedSubscription.unsubscribe();
    }
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllProducts();
      }
    });
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        this.loadAllProducts();
      },
      error: (error) => alert('Failed to delete product: ' + error.message)
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.paginateProducts();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  onSearch() {
    const productName = this.searchForm.value.productName;
    if (productName) {
      this.productService.searchProducts(productName).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (err) => {
          console.error('Error fetching search results:', err);
        }
      });
    } else {
      this.loadAllProducts();
    }
  }

  sortProductsByPrice(sortOrder: 'asc' | 'desc'): void {
    this.products.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
    this.paginateProducts(); // Re-paginate to apply the new sort order immediately
  }

  paginateProducts() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.paginateProducts();
  }

  onPageSizeChange() {
    this.pageNumber = 1;
    this.paginateProducts();
  }

  get currentPage(): number {
    return this.pageNumber;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.products.length / this.pageSize);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  addToCart(product: Product) {
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

  fetchProductsByCategory(categoryId: number) {
    this.pageNumber = 1;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.paginateProducts();
      },
      error: (err) => {
        console.error('Error fetching products for category:', err);
        this.products = []; // Clear products on error
      }
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openEditCategoryDialog(category: any): void {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openDeleteCategoryDialog(category: any): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  getImageUrl(imagePath: string): string {
    return `${this.backendUrl}${imagePath}`;
  }
}
