import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ConfigComponent } from '../config/config.component';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from '../../../services/layout.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent, 
    SidebarComponent, 
    TopbarComponent, 
    ConfigComponent,
    CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent implements OnDestroy {

  isLoading = true;
  menuItems: any[] = [];

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

  @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;

  constructor(private authService: AuthService, 
    public layoutService: LayoutService, 
    public renderer: Renderer2, 
    public router: Router,
    private userService: UserService) {    
    this.checkAuthentication();
      this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
          if (!this.menuOutsideClickListener) {
              this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                  const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target) 
                      || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
                  
                  if (isOutsideClicked) {
                      this.hideMenu();
                  }
              });
          }

          if (!this.profileMenuOutsideClickListener) {
              this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                  const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                      || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                  if (isOutsideClicked) {
                      this.hideProfileMenu();
                  }
              });
          }

          if (this.layoutService.state.staticMenuMobileActive) {
              this.blockBodyScroll();
          }
      });

      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(() => {
              this.hideMenu();
              this.hideProfileMenu();
          });

        //   this.userService.initializeUser()/* .catch(error => {
        //     console.error("Erreur lors de l'initialisation de l'ID utilisateur", error);
        //   } )*/;
  }

  hideMenu() {
      this.layoutService.state.overlayMenuActive = false;
      this.layoutService.state.staticMenuMobileActive = false;
      this.layoutService.state.menuHoverActive = false;
      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
          this.menuOutsideClickListener = null;
      }
      this.unblockBodyScroll();
  }

  hideProfileMenu() {
      this.layoutService.state.profileSidebarVisible = false;
      if (this.profileMenuOutsideClickListener) {
          this.profileMenuOutsideClickListener();
          this.profileMenuOutsideClickListener = null;
      }
  }

  blockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.add('blocked-scroll');
      }
      else {
          document.body.className += ' blocked-scroll';
      }
  }

  unblockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.remove('blocked-scroll');
      }
      else {
          document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
              'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
  }

  get containerClass() {
      return {
          'layout-theme-light': this.layoutService.config().colorScheme === 'light',
          'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
          'layout-overlay': this.layoutService.config().menuMode === 'overlay',
          'layout-static': this.layoutService.config().menuMode === 'static',
          'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
          'layout-overlay-active': this.layoutService.state.overlayMenuActive,
          'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
          'p-input-filled': this.layoutService.config().inputStyle === 'filled',
          'p-ripple-disabled': !this.layoutService.config().ripple
      }
  }

  ngOnDestroy() {
      if (this.overlayMenuOpenSubscription) {
          this.overlayMenuOpenSubscription.unsubscribe();
      }

      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
      }
  }

  checkAuthentication() {
    if (this.authService.isLoggedIn()) {
      this.isLoading = false;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
