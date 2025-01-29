import {Injectable, inject} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);

  canActivate(): boolean {
    // debugger
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.authService.navigateByUrl('/login');
      return false;
    }
  }
}

