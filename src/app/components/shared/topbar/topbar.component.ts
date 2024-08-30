import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MenuItem } from 'primeng/api';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { User } from '../../../models/user.model';


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
    DividerModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {
  
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  user: ApiResponse<User> | undefined;

  constructor(public layoutService: LayoutService,
    public authService: AuthService,
    public userService: UserService) { }

  items!: MenuItem[] | undefined;

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
                    this.logout();
                  }
              }
          ]
      },
      {
          separator: true
      }
        ];

        this.getUser();
    }

    logout() {
      this.authService.logout();
  }

  getUser() {
    this.userService.getMe()
    .subscribe(user => user = user);
    console.log(this.user);
    // return this.userService.getMe();
  }

}
