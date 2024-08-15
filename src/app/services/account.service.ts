import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, User } from '../models/account.model';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:5001/api/v1/users/me';

  constructor(private http: HttpClient, private storageService: BrowserStorageService) {}

  getAccounts(): Observable<User> {
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storageService.getItem("token")}`
    );

    // let token = this.storageService.getItem("token");
    // let header = new Headers({ 'Authorization': `Bearer ${token}` });
    // let options = {
    //    headers: header,
    // };

    return this.http.get<User>(this.apiUrl, {headers:header});
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
