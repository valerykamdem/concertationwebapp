import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) { }
}
