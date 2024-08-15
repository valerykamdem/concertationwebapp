import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserStorageService } from '../../../services/browser-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  host: {ngSkipHydration: 'true'},
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoginView: boolean = false;
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router,
    private storageService: BrowserStorageService) { }

  login() {
    //debugger;
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response: any) => {
        //debugger;
        if(response.isSuccess){
          this.storageService.setItem('token', response.value.accessToken);
          this.router.navigate(['/dashboard']);
        }       
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}
