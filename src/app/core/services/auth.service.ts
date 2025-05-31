import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private _isLoggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem(this.tokenKey)
  );
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private api: ApiService) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.api
      .post<{ token: string }>('auth/login', { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          this._isLoggedIn.next(true);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.next(false);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  register(data: any): Observable<{ token: string }> {
    return this.api
      .post<{ token: string }>('users', data)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          this._isLoggedIn.next(true);
        })
      );
  }
}
