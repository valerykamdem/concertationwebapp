import { Component, ElementRef, ViewChild, OnInit, signal, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuItem } from 'primeng/api';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ButtonModule, 
    MenubarModule,
    AvatarModule,
    MenuModule, 
    ButtonModule,
    RippleModule, 
    NgIf,
    BadgeModule,
    DividerModule,
    ConfirmDialogModule, 
    ToastModule],
    providers: [ConfirmationService, MessageService],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {
  
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  userService = inject(UserService);

  user = this.userService.getUser();

  items!: MenuItem[] | undefined;

  constructor(public layoutService: LayoutService,
    public authService: AuthService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService) { } 

  ngOnInit() {
        this.items = [
        {
          label: 'Profile',
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
      this.userService.setUserNull();
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

}
