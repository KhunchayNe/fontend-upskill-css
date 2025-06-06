import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Category } from '../category/interfaces/category.model';
import { Transaction } from './interfaces/transaction.model';
import { Goal } from './interfaces/goal.model';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css',
})
export class AccountingComponent {
  date: string = new Date().toISOString().split('T')[0]; // Initialize with current date
  categories: Category[] = [
    {
      id: 1,
      name: 'อาหาร',
      type: 'expense',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'เงินเดือน',
      type: 'income',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  selectedCategoryId: number = 1;
  amount: number = 0;
  note = '';
  transactions: Transaction[] = [];

  goal: Goal = {
    id: 1,
    name: 'เก็บเงินไปเที่ยวญี่ปุ่น',
    targetAmount: 10000,
    currentAmount: 2000,
    dueDate: '2025-12-31',
  };

  addTransaction() {
    const newItem: Transaction = {
      id: Date.now(),
      categoryId: this.selectedCategoryId,
      amount: this.amount,
      note: this.note,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.transactions.unshift(newItem);
    this.note = '';
    this.amount = 0;

    const cat = this.categories.find((c) => c.id === newItem.categoryId);
    if (cat?.type === 'income') {
      this.goal.currentAmount += newItem.amount;
    } else {
      this.goal.currentAmount -= newItem.amount;
    }
  }

  getProgress(): number {
    return Math.min(
      (this.goal.currentAmount / this.goal.targetAmount) * 100,
      100
    );
  }

  get incomeCategories(): Category[] {
    return this.categories.filter((c) => c.type === 'income');
  }

  get expenseCategories(): Category[] {
    return this.categories.filter((c) => c.type === 'expense');
  }

  getCategoryName(id: number): string {
    return this.categories.find((c) => c.id === id)?.name ?? 'N/A';
  }

  isIncome(tx: Transaction): boolean {
    const cat = this.categories.find((c) => c.id === tx.categoryId);
    return cat?.type === 'income';
  }

  deleteTransaction(id: number): void {
    // Implement the logic to delete a transaction
    this.transactions = this.transactions.filter((t) => t.id !== id);
    // You might also want to call a service method to delete from backend
    // this.accountingService.deleteTransaction(id).subscribe();
  }

  getGoalProgress(): number {
    if (!this.goal || this.goal.targetAmount === 0) return 0;

    const progress = (this.goal.currentAmount / this.goal.targetAmount) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp ระหว่าง 0-100%
  }
}
