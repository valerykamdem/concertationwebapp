import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:5001/api/v1'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient, private router: Router,
    private storageService: BrowserStorageService) { }

  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
  }

  logout() {
    this.storageService.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getItem('token');
  }
}
