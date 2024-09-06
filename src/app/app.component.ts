import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'concertationwebapp';

  constructor(private primengConfig: PrimeNGConfig, private userService: UserService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.userService.initializeUser()/* .catch(error => {
      console.error("Erreur lors de l'initialisation de l'ID utilisateur", error);
    } )*/;
  }
}
