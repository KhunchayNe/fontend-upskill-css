import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:3000'; // เปลี่ยนเป็น API จริง
  private get headers(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/${endpoint}`, data, {
      headers: this.headers,
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${endpoint}`, {
      headers: this.headers,
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${endpoint}`, data, {
      headers: this.headers,
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/${endpoint}`, {
      headers: this.headers,
    });
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.API_URL}/${endpoint}`, data, {
      headers: this.headers,
    });
  }

  uploadFile<T>(endpoint: string, file: File): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<T>(`${this.API_URL}/${endpoint}`, formData, {
      headers: this.headers,
    });
  }

  downloadFile(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${endpoint}`, {
      responseType: 'blob',
      headers: this.headers,
    });
  }
}
