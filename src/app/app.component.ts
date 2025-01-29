import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-root',
    imports: [RouterModule, NgIf, ProgressSpinner],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'concertationwebapp';
  isLoading = true;

  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  ngOnInit(){   
    if (this.authService.isAuthenticated()) {
      this.isLoading = false;
      this.authService.navigateByUrl('/');
    }else{
      this.isLoading = false;
      this.authService.navigateByUrl('/login');
    }
    
  }

}
