import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, catchError } from 'rxjs';
import { Operation } from '../models/operation.model';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ApiResponses } from '../interfaces/api-response';

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

   /** GET account by id. Will 404 if id not found */
   getOperationByAccountId(accountId: string): Observable<ApiResponses<Operation>> {
    const url = `${this.apiUrl}/operations/GetByAccountId/${accountId}`;
    return this.http.get<ApiResponses<Operation>>(url).pipe(
      // tap(_ => console.log(`fetched account id=${id}`)),
      catchError(this.handleError<ApiResponses<Operation>>(`getOperationByAccountId id=${accountId}`))
    );
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
