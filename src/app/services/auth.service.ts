import { ApiResponse, TokenResponse } from '../interfaces/api-response';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ErrorHandler } from "../errorHandler/error.handler";
import { UserService} from "./user.service";
import { jwtDecode, JwtPayload } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl; // Remplace par l'URL de ton API

  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private userService = inject(UserService);

  login(credentials: LoginRequest): Observable<ApiResponse<TokenResponse | null>> {
    this.logout();
    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((response: ApiResponse<TokenResponse>) => {
          if (response.isSuccess) {
            this.storeTokens(response.value!);
          }
        }),
        catchError((error: HttpErrorResponse) => ErrorHandler.handleError<TokenResponse>(error))
      );
  }

  /**
   * 🔄 Récupère un nouveau token via le refreshToken
   */
  refreshToken(): Observable<ApiResponse<TokenResponse | null>> {
    const refreshToken = this.cookieService.get('refresh_token');

    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/auth/refreshToken`, {refreshToken})
      .pipe(tap(response => {
          if (response.isSuccess) {
            this.storeTokens(response.value!);
            this.userService.getUser().subscribe(); //get the user and save it in the user service
          } else {
            this.logout();
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.logout(); //logout if there is an error
          return ErrorHandler.handleError<TokenResponse>(error);
        })
      );
  }

  /**
   * 📌 Stocke les tokens dans des cookies sécurisés
   */
  storeTokens(token: TokenResponse): void {
    this.cookieService.set('access_token', token.accessToken, {
      expires: 1, // Expiration en 1 jour
      secure: true, // Seulement accessible en HTTPS
      sameSite: 'Strict', // Protection CSRF
      path: '/' // Accessible dans toute l'application
    });

    this.cookieService.set('refresh_token', token.refreshToken, {
      expires: 7, // Expiration en 7 jours
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });
  }

  /**
   * 🔍 Récupère l'access token depuis les cookies
   */
  getAccessToken(): string {
    return this.cookieService.get('access_token');
  }

  /**
   * ✅ Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = this.cookieService.get('access_token');
    return !!token;
  }
  /**
   * ✅ Vérifie si l'utilisateur authentifié a un token valide
   */
  isValidToken(): boolean {
    // you can use JWT here to check the validity of the token
    const token = this.cookieService.get('access_token');
    // return !!token;
// console.log(token);
    if(token){
      // const decodedToken = jwtDecode(token) as JwtPayload;
            const decodedToken = jwtDecode<JwtPayload>(token);
            console.log(decodedToken);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decodedToken.exp! > currentTime;
        }
        return false;
}

  /**
   * 🚪 Déconnexion et suppression des tokens
   */
  logout(): void {
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.router.navigate(['/auth/login']);
  }

  navigateByUrl(url: string): void {
    // let booleanPromise = this.router.navigateByUrl(url, {replaceUrl: true});
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

}
