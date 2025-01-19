import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuComponent } from '../menu/menu.component';


@Component({
    selector: 'app-sidebar',
    imports: [MenuComponent],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class SidebarComponent {

  constructor(public layoutService: LayoutService, public el: ElementRef) { } 
}
