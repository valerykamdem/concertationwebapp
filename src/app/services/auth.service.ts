import { AuthResponse } from './../interfaces/api-response';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserStorageService } from './browser-storage.service';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, map, Observable, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl; // Remplace par l'URL de ton API
  private authResponse = signal<AuthResponse | null | undefined>(undefined);
  private currentToken = signal<string | null>(null);
  private currentRefreshToken = signal<string | null>(null);

  constructor(private http: HttpClient, 
    private router: Router,
    private storageService: BrowserStorageService) { 
      this.currentToken.set(this.storageService.getItem('authToken') || '');
      this.currentRefreshToken.set(this.storageService.getItem('refreshToken') || '');
    }

  currentTokenValue() {
      return this.currentToken;
    }

  currentRefreshTokenValue() {
      return this.currentRefreshToken;
    }

  login(credentials: LoginRequest) : Observable<AuthResponse | null | undefined> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(tap((result: AuthResponse) => {
      if(result.isSuccess){
        this.storageService.setItem('authToken', result.value.accessToken);
        this.storageService.setItem('refreshToken', result.value.refreshToken);
        this.currentToken.set(result.value.accessToken || '');
        this.currentRefreshToken.set(result.value.refreshToken || '');        
      }
    }),
    map((result: AuthResponse) => {    
      return this.authResponse()
    }));
  }

  logout() {
    this.storageService.clear();
    this.authResponse.set(null);
    this.currentToken.set(null);
    this.currentRefreshToken.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getItem('authToken');
  }

  refreshToken(): Observable<AuthResponse> {
    let refreshTo: any = {
      refreshToken: this.currentRefreshTokenValue()
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refreshToken`, refreshTo)
      .pipe(tap( _ => console.log("fetched refresh Token")), 
    catchError(this.handleError<AuthResponse>('refreshToken')));
  }

  setToken(authResponse: AuthResponse){
    this.storageService.setItem('authToken', authResponse.value.accessToken);
    this.storageService.setItem('refreshToken', authResponse.value.refreshToken);
    this.currentToken.set(authResponse.value.accessToken);  
  }

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
