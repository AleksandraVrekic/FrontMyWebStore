import { Component, Inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent {

  constructor(
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onDelete(): void {
    this.categoryService.deleteCategory(this.data.categoryId).subscribe({
      next: () => {
        console.log('Category deleted successfully');
        this.dialogRef.close(true); // Close the dialog on successful delete
      },
      error: (error) => {
        console.error('Failed to delete category:', error.message);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

