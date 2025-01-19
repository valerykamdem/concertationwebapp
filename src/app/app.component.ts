import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { PrimeNGConfig } from 'primeng/api';
import { UserService } from './services/user.service';


@Component({
    selector: 'app-root',
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'concertationwebapp';

  userService = inject(UserService);

  // constructor(private primengConfig: PrimeNGConfig) {}

  // ngOnInit() {
  //   // this.primengConfig.ripple = true;

  //   // this.userService.initializeUser();
  //   /* .catch(error => {
  //     console.error("Erreur lors de l'initialisation de l'ID utilisateur", error);
  //   } )*/
  // }
}
