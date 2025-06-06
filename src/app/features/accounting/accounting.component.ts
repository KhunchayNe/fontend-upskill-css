import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Category } from '../category/interfaces/category.model';
import { Transaction } from './interfaces/transaction.model';
import { Goal } from './interfaces/goal.model';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { AccountingService } from '../../core/services/accounting.service';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css',
})
export class AccountingComponent {
  date: string = new Date().toISOString().split('T')[0]; // Initialize with current date
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private accountingService: AccountingService // Assuming this service handles transactions
  ) {}
  categories: Category[] = [];
  userId: string | null = null;
  loading = true;

  ngOnInit() {
    this.fetchCategories();
    this.fetchGoal();
  }

  fetchCategories() {
    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }
    this.userId = userId;
    this.categoryService.getCategoriesByUser(userId).subscribe({
      next: (data: Category[]) => {
        console.log('Fetched categories:', data);
        this.loading = false;
        this.categories = data;
      },
      error: (error: unknown) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      },
    });
  }

  fetchGoal() {
    this.accountingService.getGoalsByUser(this.userId!).subscribe({
      next: (goal: Goal[]) => {
        console.log('Fetched goal:', goal);
        this.goal = {
          ...goal[0],
          currentAmount: Number(goal[0].currentAmount) || 0, // Ensure currentAmount is initialized
          amountTarget: Number(goal[0].amountTarget) || 0, // Ensure amountTarget is initialized
        }; // Assuming we only need the first goal
        console.log('Goal:', this.goal);
        this.getAdvice(goal[0].id);
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error fetching goal:', error);
        this.loading = false;
      },
    });
  }

  selectedCategoryId: number = 1;
  amount: number = 0;
  note = '';
  transactions: Transaction[] = [];

  goal!: Goal; // Using definite assignment assertion

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

    console.log('Adding transaction:', newItem);

    this.accountingService
      .createTransaction({
        userId: this.userId,
        categoryId: this.selectedCategoryId,
        amount: this.amount,
        note: this.note,
        type:
          this.categories.find((c) => c.id == this.selectedCategoryId)?.type ||
          'expense',
        date: newItem.date,
      })
      .subscribe({
        next: (data: Transaction) => {
          console.log('Transaction created:', data);
          this.transactions.unshift(newItem);
          this.note = '';
          this.amount = 0;
          console.log(' this.categories', this.categories);
          const cat = this.categories.find((c) => c.id == newItem.categoryId);

          if (!cat) {
            console.error('Category not found for transaction:', newItem);
            return;
          }
          console.log('Category found:', cat);
            if (cat?.type === 'income') {
            this.goal.currentAmount += Number(newItem.amount);
            } else {
            this.goal.currentAmount -= Number(newItem.amount);
            }
          this.getAdvice(this.goal.id);
        },
        error: (error: unknown) => {
          console.error('Error creating transaction:', error);
        },
      });
  }

  getProgress(): number {
    return Math.min(
      (Number(this.goal.currentAmount) / Number(this.goal.amountTarget)) * 100,
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
    return this.categories.find((c) => c.id == id)?.name ?? 'N/A';
  }

  isIncome(tx: Transaction): boolean {
    const cat = this.categories.find((c) => c.id == tx.categoryId);
    return cat?.type === 'income';
  }

  deleteTransaction(id: number): void {
    // Implement the logic to delete a transaction
    this.transactions = this.transactions.filter((t) => t.id !== id);
    // You might also want to call a service method to delete from backend
    // this.accountingService.deleteTransaction(id).subscribe();
  }

  getGoalProgress(): number {
    if (!this.goal || this.goal.amountTarget === 0) return 0;
    console.log('Calculating goal progress:', (Number(this.goal.currentAmount) / Number(this.goal.amountTarget)) * 100);
    console.log('Current Amount:', this.goal.currentAmount);
    console.log('Amount Target:', this.goal.amountTarget);
    const progress =
      (Number(this.goal.currentAmount) / Number(this.goal.amountTarget)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp ระหว่าง 0-100%
  }

  advice: string = 'Loading advice...';

  getAdvice(goalId?: number): string {
    const id = goalId || this.goal.id;
    this.accountingService.getGeminiAdvice(id).subscribe({
      next: (advices: any) => {
        console.log('Advice from Gemini:', advices);
        this.advice = advices.advice || 'No advice available.';
      },
      error: (error: unknown) => {
        console.error('Error fetching advice:', error);
        this.advice = 'No advice available at the moment.';
      },
    });
    return this.advice;
  }
}
