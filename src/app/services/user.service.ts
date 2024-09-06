import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private user = signal<User | null | undefined>(undefined);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/me`);
  }

  initializeUser(): Promise<User | null | undefined> {
    console.log("initializerUser");
    console.log();
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/me`).toPromise()
      .then(response => {
        console.log("initializerUserResp");
        console.log(response?.value);
        this.user.set(response?.value);
        return response?.value;
      });
  }

  getUser() {
    return this.user;
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
