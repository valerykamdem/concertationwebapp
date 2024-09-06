import { inject, Injectable, WritableSignal } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { BrowserStorageService } from '../services/browser-storage.service';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../interfaces/api-response';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private storageService = inject(BrowserStorageService);
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.currentTokenValue()) {
      request = this.AddTokenHeader(request, this.authService.currentTokenValue()()!);
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
        switchMap((token: AuthResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.value.refreshToken);
          return next.handle(this.AddTokenHeader(request, token!.value.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // this.authService.logout();
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
