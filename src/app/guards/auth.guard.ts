import {Injectable, inject} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';
import { Observable, of, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);

  canActivate(): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.authService.navigateByUrl('/auth/login');
      return of(false); // Not authenticated, redirect and return false
    }

    if(this.authService.isValidToken()){
      return of(true);// Token is still valid
    } else {
      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          // Check if the refresh was successful
          if(response.isSuccess){
            return of(true);
          } else {
            this.authService.logout(); // Logout if refresh fails
            return of(false);
          }
        }),
        catchError(() => {
          this.authService.logout(); // Logout on error
          return of(false);
        })
      );
    }
  }

  // canActivate(): boolean {
  //   // debugger
  //   if (this.authService.isAuthenticated()) {
  //     return true;
  //   } else {
  //     this.authService.navigateByUrl('/login');
  //     return false;
  //   }
  // }
}

