import { Component } from '@angular/core';
import { Category } from './interfaces/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CategoryService } from '../../core/services/category.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  constructor(private categoryService: CategoryService, private authService: AuthService) {}
  categories: Category[] = [];
  loading = true;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    // This method would typically call a service to fetch categories from an API
    // For now, we'll just use the mock data that's already defined
    // In a real application, you would replace this with an API call:
    console.log('Fetching categories...');
    const userId = this.authService.getUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.categoryService.getCategoriesByUser(userId).subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      },
    });
  }

  // categories: Category[] = [
  //   { id: 1, name: 'เงินเดือน', type: 'income' },
  //   { id: 2, name: 'อาหาร', type: 'expense' },
  // ];

  name = '';
  type: 'income' | 'expense' = 'income';
  editingId: number | null = null;

  get isEditing() {
    return this.editingId !== null;
  }

  submitForm() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    if (this.isEditing) {
      const category = this.categories.find((c) => c.id === this.editingId);
      if (category) {
        category.name = this.name;
        category.type = this.type;

        const newCategory: Category = {
          id: this.editingId ?? 0,
          name: this.name,
          type: this.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.categoryService
          .updateCategory(category.id, {
            name: this.name,
            type: this.type,
            userId,
          })
          .subscribe({
            next: (data: Category) => {
              console.log('Category updated:', data);
              const index = this.categories.findIndex((c) => c.id === category.id);
              if (index !== -1) {
                this.categories[index] = newCategory;
              }
            },
            error: (error: unknown) => {
              console.error('Error updating category:', error);
            },
          });
      }
    } else {
      const newCategory: Category = {
        id: this.editingId ?? 0,
        name: this.name,
        type: this.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.categoryService
        .createCategory({
          name: this.name,
          type: this.type,
          userId,
        })
        .subscribe({
          next: (data: Category) => {
            console.log('Category created:', data);
            this.categories.push(data);
          },
          error: (error: unknown) => {
            console.error('Error creating category:', error);
          },
        });
    }

    this.clearForm();
  }

  editCategory(category: Category) {


    this.name = category.name;
    this.type = category.type;
    this.editingId = category.id;
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (data :any) => {
            if (data.affected && data.affected > 0) {
              this.categories = this.categories.filter((c) => c.id !== id);
              if (this.editingId === id) {
                this.clearForm();
              }
              console.log('Category deleted successfully');
              Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
              });
            } else {
              console.error('Category not found or already deleted');
            }

          },
          error: (error: unknown) => {
            console.error('Error deleting category:', error);
          },
        });

      }
    });

  }

  clearForm() {
    this.name = '';
    this.type = 'income';
    this.editingId = null;
  }
}
