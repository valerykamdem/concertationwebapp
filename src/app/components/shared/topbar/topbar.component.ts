import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuItem,ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ConfiguratorComponent } from "../configurator/configurator.component";

@Component({
    selector: 'app-topbar',
    imports: [
        CommonModule,
        RouterModule,
        AvatarModule,
        Menu,
        ButtonModule,
        RippleModule,
        BadgeModule,
        ConfirmDialog,
        ToastModule,
        ConfiguratorComponent,
        StyleClassModule],
    providers: [ConfirmationService, MessageService],
    templateUrl: './topbar.component.html'
    // styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {

  userService = inject(UserService);
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  items!: MenuItem[] | undefined;

  ngOnInit() {
        this.items = [
        {
          // label: 'Profile',
          items: [
            {
              label: 'Profil',
              icon: 'pi pi-user',
              shortcut: '⌘+O',
              routerLink: ['/profile']
          },
              {
                  label: 'Settings',
                  icon: 'pi pi-cog',
                  shortcut: '⌘+O',
                  routerLink: ['/reglage']
              },
              {
                  label: 'Logout',
                  icon: 'pi pi-sign-out',
                  shortcut: '⌘+Q',
                  command: () => {
                    this.confirm();
                  }
              }
          ]
      },
      {
          separator: true
      }
        ];
    }

  logout() {
      this.authService.logout();
      // this.userService.setUserNull();
  }

  confirm() {
    this.confirmationService.confirm({
        header: 'Voulez-vous vous deconnecter?',
        message: 'S´il vous plaît confirmer.',
        accept: () => {
          this.authService.logout();
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Vous êtes deconecter', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'Bienvenue', life: 3000 });
        }
    });
  }

  toggleDarkMode() {
    // this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    this.layoutService.toggleDarkTheme();
  }

}
