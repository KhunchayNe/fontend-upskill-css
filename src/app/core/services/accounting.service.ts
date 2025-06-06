import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  constructor(private api: ApiService) {}

  /**
   * Get goals for a specific user
   * @param userId The ID of the user
   * @returns An Observable with the goals data
   */
  getGoalsByUser(userId: string): any {
    return this.api.get<any>(`goals/user/${userId}`);
  }

  /**
   * Get Gemini advice with specified ID
   * @param adviceId The ID of the advice to retrieve
   * @returns An Observable with the Gemini advice data
   */
  getGeminiAdvice(adviceId: number): any {
    return this.api.get<any>(`ai/gemini-advice/${adviceId}`);
  }

  /**
   * Create a new transaction
   * @param transaction The transaction data to submit
   * @returns An Observable with the created transaction data
   */
  createTransaction(transaction: any): any {
    return this.api.post<any>('transactions', transaction);
  }
}
