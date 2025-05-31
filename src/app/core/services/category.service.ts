import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private api: ApiService) { }

  /**
   * Get categories for a specific user
   * @param userId The ID of the user
   * @returns An Observable with the categories data
   */
  getCategoriesByUser(userId: string): any{
    return this.api.get<any>(`categories/user/${userId}`);
  }

  /**
   * Create a new category for a user
   * @param userId The ID of the user
   * @param categoryData The data for the new category
   * @returns An Observable with the created category data
   */
  createCategory(categoryData: any): Observable<any> {
    return this.api.post<any>(`categories/`, categoryData);
  }

  /**
   * Update an existing category
   * @param categoryId The ID of the category to update
   * @param categoryData The updated data for the category
   * @returns An Observable with the updated category data
   */
  updateCategory(categoryId: number, categoryData: any): Observable<any> {
    return this.api.put<any>(`categories/${categoryId}`, categoryData);
  }

  /**
   * Delete a category by its ID
   * @param categoryId The ID of the category to delete
   * @returns An Observable with the deletion result
   */
  deleteCategory(categoryId: number): Observable<any> {
    return this.api.delete<any>(`categories/${categoryId}`);
  }
}
