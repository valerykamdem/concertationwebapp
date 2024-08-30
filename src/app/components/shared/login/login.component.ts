import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { AuthResponse } from '../../../interfaces/api-response';
import { LoginRequest } from '../../../interfaces/login-request';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  host: {ngSkipHydration: 'true'},
  imports: [ReactiveFormsModule, RouterLink, 
    InputTextModule, CheckboxModule, 
    ButtonModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  private formBuilder = inject(FormBuilder);
  private loginSubscription: Subscription | null = null;
  valCheck: string[] = ['remember'];

  constructor(private authService: AuthService, private router: Router) { 
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

      loginFormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });


  login() {
    if (this.loginFormGroup.valid) {
      let loginRequest: LoginRequest = {
        email: this.loginFormGroup.value.email as string,
        password: this.loginFormGroup.value.password as string
      }

    this.loginSubscription = this.authService.login(loginRequest).subscribe({
      next: (result: AuthResponse | null | undefined) => {
        this.router.navigate(['/']); 
      },
      error: error => {
        console.error('Login failed', error);
      }
    });
  }
}

ngOnDestroy(): void {
  this.loginSubscription?.unsubscribe();
}

}
