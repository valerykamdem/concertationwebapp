import { Component, inject, Input } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuService } from '../../../services/menu.service';
import { ButtonModule } from 'primeng/button';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-floating-configurator',
  imports: [ButtonModule, StyleClassModule, ConfiguratorComponent],
  templateUrl: './floatingconfigurator.component.html',
  styleUrl: './floatingconfigurator.component.css'
})
export class ConfigComponent {
  @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];

    public layoutService = inject(LayoutService);
    public menuService = inject(MenuService);
}