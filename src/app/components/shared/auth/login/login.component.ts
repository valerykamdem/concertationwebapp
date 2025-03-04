import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {ApiResponse, TokenResponse} from '../../../../interfaces/api-response';
import {LoginRequest} from '../../../../interfaces/login-request';
import {ButtonModule} from 'primeng/button';
import {Subscription} from 'rxjs';
import {PasswordModule} from 'primeng/password';
import {Message} from "primeng/message";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  host: {ngSkipHydration: 'true'},
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    Message,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy, OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private loginSubscription: Subscription | null = null;
  errorSigIn = signal<string | null | undefined>(undefined);
  //valCheck: string[] = ['remember'];
  loginFormGroup!: FormGroup;


  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.navigateByUrl('/');
    } else {
      this.authService.navigateByUrl('/auth/login');
    }

    console.log("dans login");
    this.errorSigIn.set(null);
    this.loginFormGroup = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      checked: [''],
    });

    this.loginFormGroup.get('email')?.setValue('kkvccloud@outlook.com');
    this.loginFormGroup.get('password')?.setValue('Password1#');
  }


  login() {
    if (this.loginFormGroup.valid) {
      let loginRequest: LoginRequest = {
        email: this.loginFormGroup.value.email as string,
        password: this.loginFormGroup.value.password as string,
      };

      this.loginSubscription = this.authService.login(loginRequest).subscribe({
        next: (result: ApiResponse<TokenResponse | null | undefined>) => {
          // Stocker les tokens dans des cookies
          if (result?.isSuccess) {
            this.authService.navigateByUrl('/');
          }else{
            this.errorSigIn.set('Échec de l\'authentification');
          }
        },
        error: (error) => {
          this.errorSigIn.set(error.description);
          console.error('Login failed', error);
        },
      });
    }
  }


  // login() {
  //   if (this.loginFormGroup.valid) {
  //     let loginRequest: LoginRequest = {
  //       email: this.loginFormGroup.value.email as string,
  //       password: this.loginFormGroup.value.password as string,
  //     };
  //
  //     this.loginSubscription = this.authService.login(loginRequest).subscribe({
  //       next: (result: AuthResponse | null | undefined) => {
  //         // this.router.navigate(['/']);
  //         this.authService.navigateByUrl('/');
  //       },
  //       error: (error) => {
  //         console.error('Login failed', error);
  //       },
  //     });
  //   }
  // }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
