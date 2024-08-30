import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.apiUrl}`);
  }

  deposit(accountNumber: string, amount: number): Observable<Operation> {
    return this.http.post<Operation>(`${this.apiUrl}/operations/deposit`, { accountNumber, amount });
  }

  withdraw(accountNumber: number, amount: number): Observable<Operation> {
    return this.http.post<Operation>(`${this.apiUrl}/operations/withdraw`, { accountNumber, amount });
  }

  transfer(fromAccountNumber: string, toAccountNumber: string, amount: number, itendedUse: string): Observable<Operation> {
    return this.http.post<Operation>(`${this.apiUrl}/operations/transfer`, 
      { fromAccountNumber, toAccountNumber, amount,  itendedUse});
  }
}
