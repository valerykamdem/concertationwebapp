import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {TabsModule} from "primeng/tabs";
import {AvatarModule} from "primeng/avatar";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TabsModule, AvatarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
