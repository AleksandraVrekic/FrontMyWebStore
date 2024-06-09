import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import { OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Product, ProductFormData } from '../../models/product-model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<AddProductComponent>
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      categoryName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const selectedCategory = this.categories.find(category => category.categoryName === formValue.categoryName);

      if (selectedCategory) {
        const productData: ProductFormData = {
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          quantity: formValue.quantity,
          category: {
            categoryId: selectedCategory.categoryId,
            categoryName: selectedCategory.categoryName
          }
        };

        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }

        this.productService.createProduct(formData).subscribe({
          next: (product) => {
            console.log('Product added successfully:', product);
            this.dialogRef.close(); // Close the dialog on successful add
          },
          error: (error) => {
            console.error('Failed to add product:', error.message);
          }
        });
      } else {
        console.error('Selected category not found');
      }
    } else {
      console.error('Form is not valid:', this.productForm.errors);
    }
  }

}
