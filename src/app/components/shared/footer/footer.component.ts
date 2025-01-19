import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';

@Component({
    selector: 'app-footer',
    imports: [],
    template: `<div class="layout-footer">
    <!-- <img src="assets/layout/images/{{layoutService.config().colorScheme === 'light' ? 'logo-dark' : 'logo-white'}}.svg" alt="Logo" height="20" class="mr-2"/> -->
     <img src="assets/images/logo.png" alt="Logo" width="54" height="11" class="mr-2"/>
    by
    <span class="font-medium ml-2">KKVC</span>
</div>`
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) { }
}
