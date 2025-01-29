import { inject, Injectable, signal } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, of, catchError } from 'rxjs';
import { Operation } from '../models/operation.model';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { Cacheable } from 'ts-cacheable'
import {ErrorHandler} from "../errorHandler/error.handler";

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private apiUrl = environment.apiUrl;
  private accountSource = new BehaviorSubject<Account | null>(null);
  private currentAccount = signal<Account | null>(null);
  private http = inject(HttpClient);

  @Cacheable()
  getOperations(): Observable<ApiResponse<Operation[] | null>> {
    return this.http.get<ApiResponse<Operation[]>>(`${this.apiUrl}`)
      .pipe(
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<Operation[]>(error))
      );
  }

  @Cacheable()
   /** GET account by id. Will 404 if id not found */
   getOperationByAccountId(accountId: string): Observable<ApiResponse<Operation[] | null>> {
    const url = `${this.apiUrl}/operations/GetByAccountId/${accountId}`;
    return this.http.get<ApiResponse<Operation[]>>(url).pipe(
      // tap(_ => console.log(`fetched account id=${id}`)),
      catchError((error: HttpErrorResponse) => ErrorHandler.handleError<Operation[]>(error))
    );
  }

  changeAccount(account: Account) {
    // this.accountSource.next(account);
    this.currentAccount.set(account);
  }

  currentAccountValue() {
    return this.currentAccount;
  }

}
