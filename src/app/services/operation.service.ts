import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Operation } from '../models/operation.model';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private apiUrl = environment.apiUrl;
  private accountSource = new BehaviorSubject<Account | null>(null);
  private currentAccount = signal<Account | null>(null);
  // currentAccount = this.accountSource.asObservable();

  constructor(private http: HttpClient) {}

  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.apiUrl}`);
  }

  changeAccount(account: Account) {
    // this.accountSource.next(account);
    this.currentAccount.set(account);
  }

  currentAccountValue() {
    return this.currentAccount;
  }

}
