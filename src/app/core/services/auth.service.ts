import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { jwtDecode } from 'jwt-decode';

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
      .post<{ access_token: string }>('auth/login', { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.access_token);
          this._isLoggedIn.next(true);
        }),
        map(res => ({ token: res.access_token }))
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
    return this.api.post<{ token: string }>('users', data).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this._isLoggedIn.next(true);
      })
    );
  }

  decode(): JwtPayload | null {
    // console.log('token:', this.token);
    if (!this.token) return null;

    try {
      return jwtDecode<JwtPayload>(this.token);
    } catch (err) {
      console.error('❌ Invalid JWT token:', err);
      return null;
    }
  }

  getUserId(): string | null {
    // console.log('getUserId called');
    return this.decode()?.sub ?? null;
  }

  isTokenExpired(): boolean {
    const payload = this.decode();
    if (!payload?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}


export interface JwtPayload {
  userId: number;
  email: string;
  exp?: number;
  sub?: string;
  // เพิ่ม field อื่น ๆ ถ้าต้องการ
}

