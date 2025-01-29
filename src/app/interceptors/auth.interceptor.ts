import {inject, Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, filter, Observable, throwError} from 'rxjs';
import {catchError, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {ApiResponse, TokenResponse} from "../interfaces/api-response";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  authService = inject(AuthService);
  isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authReq = request;
    const token = this.authService.getAccessToken(); // Récupérer le token

    if (token) {
      request = this.AddTokenHeader(request, token!);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private AddTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: ApiResponse<TokenResponse | null>) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.value!.refreshToken);
          return next.handle(this.AddTokenHeader(request, token.value!.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((accessToken :any) => {
          return next.handle(this.AddTokenHeader(request, accessToken));
        })
      );
    }
  }

}
