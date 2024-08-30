import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrowserStorageService } from './browser-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl : string =  environment.apiUrl;

  constructor(private http: HttpClient, private storageService: BrowserStorageService) {}

  // Other CRUD methods...
  getAccounts() {
    return this.http.get(`${this.apiUrl}/accounts`);
  }

  deposit(accountId: string, amount: number) {
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/deposit`, { amount });
  }

  withdraw(accountId: string, amount: number) {
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/withdraw`, { amount });
  }

  transfer(fromAccountId: string, toAccountId: string, amount: number) {
    return this.http.post(`${this.apiUrl}/accounts/transfer`, { fromAccountId, toAccountId, amount });
  }
}
