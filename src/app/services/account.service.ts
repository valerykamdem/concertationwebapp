import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrowserStorageService } from './browser-storage.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse, ApiResponses } from '../interfaces/api-response';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl : string =  environment.apiUrl;
  private selectedAccount: Account | null = null;
  private currentAccount = signal<Account | null>(null);

  constructor(private http: HttpClient, private storageService: BrowserStorageService) {}

   // Other CRUD methods...
   getAccounts() : Observable<ApiResponses<Account>> {
    return this.http.get<ApiResponses<Account>>(`${this.apiUrl}/accounts`).pipe(
      tap(_ => console.log("fetched accounts")),
      catchError(this.handleError<ApiResponses<Account>>("getAccounts"))
    );
  }

  /** GET account by id. Will 404 if id not found */
  getAccount(id: string): Observable<ApiResponses<Account>> {
    const url = `${this.apiUrl}/accounts/GetByUserId/${id}`;
    return this.http.get<ApiResponses<Account>>(url).pipe(
      // tap(_ => console.log(`fetched account id=${id}`)),
      catchError(this.handleError<ApiResponses<Account>>(`getAccount id=${id}`))
    );
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

  setSelectedAccount(account: Account) {
    this.selectedAccount = account;
  }

  getSelectedAccount(): Account | null {
    return this.selectedAccount;
  }

  clearSelectedAccount() {
    this.selectedAccount = null;
  }

  changeAccount(account: Account) {
    // this.accountSource.next(account);
    this.currentAccount.set(account);
  }

  currentAccountValue() {
    return this.currentAccount;
  }

 /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
 private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

log(arg0: string) {
  throw new Error('Method not implemented.');
}

}
