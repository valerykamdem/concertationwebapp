import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
  MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(public layoutService: LayoutService, public el: ElementRef) { } 
}
