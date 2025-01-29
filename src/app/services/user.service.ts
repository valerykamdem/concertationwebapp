import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { Cacheable } from 'ts-cacheable'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  user = signal<User | null | undefined>(undefined);
  private http = inject(HttpClient);

  @Cacheable()
  getUser(): Observable<ApiResponse<User>> {
    // @ts-ignore
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/me`)
    .pipe(tap((result: any) => {
      if(result.isSuccess){
        this.user.set(result.value);
      }
    }));//, map((result: ApiResponse<| null | undefined>) => { return this.user(); }));
  }

  @Cacheable()
  getUserByAccountnumber(accountNbr: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/GetByAccountNumber/${accountNbr}`);
  }

  setUserNull(): void {
    this.user.set(null);
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
