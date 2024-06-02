import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product-model';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent implements OnChanges  {

  @Input() selectedCategoryId: number | null = null;
  products: Product[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId'] && changes['selectedCategoryId'].currentValue !== null) {
      // Ensure the ID is not null before passing it to the service
      this.categoryService.getCategoryProducts(changes['selectedCategoryId'].currentValue)
        .subscribe(data => {
          this.products = data;
        });
    }
  }
}
