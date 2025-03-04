import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {catchError, Observable, Subject, tap} from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Account } from '../models/account.model';
import { Cacheable } from 'ts-cacheable'
import {TransferRequest} from "../interfaces/transfer-request";
import {UserPinRequest} from "../interfaces/userPin-request";
import {ErrorHandler} from "../errorHandler/error.handler"
import {OperationRequest} from "../interfaces/operation-request";

const cacheBuster$ = new Subject<void>()
cacheBuster$.next()

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl: string = environment.apiUrl;
  private selectedAccount: Account | null = null;
  private http = inject(HttpClient);


  @Cacheable({cacheBusterObserver: cacheBuster$})
  // Other CRUD methods...
  getAccounts(): Observable<ApiResponse<Account[] | null>> {
    const url = `${this.apiUrl}/accounts/GetUserAccounts`;
    return this.http.get<ApiResponse<Account[]>>(url)
      .pipe(
        // tap((_) => console.log('fetched accounts')),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<Account[]>(error))
      );
  }

  @Cacheable({cacheBusterObserver: cacheBuster$})
  /** GET account by id. Will 404 if id not found */
  getUserAccountWithOperations(): Observable<ApiResponse<Account[] | null>> {
    const url = `${this.apiUrl}/accounts/GetUserAccountsWithOperations`;
    return this.http.get<ApiResponse<Account[]>>(url)
      .pipe(
      // tap(_ => console.log(`fetched account id=${id}`)),
      catchError((error: HttpErrorResponse) => ErrorHandler.handleError<Account[]>(error))
    );
  }

  @Cacheable()
  getByAccountNumber(accountNbr: string): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/Accounts/GetByAccountNumber/${accountNbr}`);
  }

  deposit(depositRequest: OperationRequest) {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/operations/deposit`,
      depositRequest)
      .pipe(tap(() => cacheBuster$.next()),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<boolean>(error)));
  }

  withdrawal(withdrawalRequest: OperationRequest) {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/operations/withdraw`,
      withdrawalRequest)
      .pipe(tap(() => cacheBuster$.next()),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<boolean>(error)));
  }

  transfer(transferRequest: TransferRequest){
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/operations/transfer`,
      transferRequest)
      .pipe(tap(() => cacheBuster$.next()),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<boolean>(error)))
  }

  checkUserPin(userPinRequest: UserPinRequest){
    // console.log("result checkpin", userPinRequest);
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/userPins/userPinCheck`,
      userPinRequest)
      .pipe(
        // tap((result: ApiResponse<boolean>) => {
        // if(result.isSuccess){
        //   console.log("result checkpin", result);
        // }else{
        //   console.log("result checkpin else", result);
        // }
        // }
      // ),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<boolean>(error))
      );
  }

  getSelectedAccount(): Account | null {
    return this.selectedAccount;
  }
}
