import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
// import {ConfigComponent} from "../../floatingconfigurator/floatingconfigurator.component";

@Component({
  selector: 'app-access',
  imports: [ButtonModule, RouterModule, RippleModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {

}
