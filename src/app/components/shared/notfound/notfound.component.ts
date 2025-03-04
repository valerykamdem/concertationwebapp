import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// import {ConfigComponent} from "../floatingconfigurator/floatingconfigurator.component";
import {Button} from "primeng/button";

@Component({
    selector: 'app-notfound',
  imports: [RouterLink, Button],
    templateUrl: './notfound.component.html',
    styleUrl: './notfound.component.css'
})
export class NotFoundComponent {

}
