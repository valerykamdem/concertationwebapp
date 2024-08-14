import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:5001/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  // Other CRUD methods...
  getAccounts1() {
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
