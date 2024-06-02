import { Component, OnInit } from '@angular/core';
import { Init } from 'v8';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{

  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
  }

}
