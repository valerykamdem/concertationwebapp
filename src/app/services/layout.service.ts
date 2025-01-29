import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface layoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible?: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
showProfileSidebar() {
throw new Error('Method not implemented.');
}
    _config: layoutConfig = {
        preset: 'Lara',
        primary: 'emerald',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    // layoutConfig = signal<layoutConfig>(this._config);
  layoutConfig = signal<layoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();

    private overlayOpen = new Subject<any>();

    private menuSource = new Subject<MenuChangeEvent>();

    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();

    resetSource$ = this.resetSource.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    theme = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));

    isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    getPrimary = computed(() => this.layoutConfig().primary);

    getSurface = computed(() => this.layoutConfig().surface);

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    private initialized = false;

    // Custom Concertation
  private readonly LAYOUT_CONFIG_KEY: string = 'layout-config';
  // End Custom Concertation

    constructor() {
      this.loadSavedConfig().then(config => {
        this.layoutConfig.set(config);
      });
        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });
    }

    // Custom Concertation
  // Charge la configuration sauvegardée
  private loadSavedConfig(): Promise<layoutConfig> {
    return new Promise((resolve) => {
    try {
      const savedConfig = localStorage.getItem(this.LAYOUT_CONFIG_KEY);
      if (savedConfig) {
        resolve({ ...this._config, ...JSON.parse(savedConfig) });
      } else {
        resolve(this._config);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      resolve(this._config);
    }
    });
  }

  // Sauvegarde la configuration
  private saveConfig(config: layoutConfig): void {
    localStorage.setItem(this.LAYOUT_CONFIG_KEY, JSON.stringify(config));
  }

  toggleDarkTheme(): void {
    this.layoutConfig.update(config => {
      const updatedConfig = { ...config, darkTheme: !config.darkTheme };
      this.saveConfig(updatedConfig);
      return updatedConfig;
    });
  }

  updateColorTheme(type: string, color: any): void {
    this.layoutConfig.update(config => {
      let updatedConfig = {};//{ ...config, darkTheme: !config.darkTheme };
      if(type === 'primary'){
        updatedConfig = { ...config, primary: color };
      }else if(type === 'surface'){
        updatedConfig = { ...config, surface: color };
      }
      this.saveConfig(updatedConfig);
      return updatedConfig;
    });
  }

  updatePreset(preset: any): void {
    this.layoutConfig.update(config => {
      const updatedConfig = { ...config, preset: preset };
      this.saveConfig(updatedConfig);
      return updatedConfig;
    });
  }

  updateMenuMode(event: string): void {
    this.layoutConfig.update(config => {
      const updatedConfig = { ...config, menuMode: event };
      this.saveConfig(updatedConfig);
      return updatedConfig;
    });
  }

  // End Custom Concertation


    private handleDarkModeTransition(config: layoutConfig): void {
        if ((document as any).startViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this.onTransitionEnd();
            })
            .catch(() => {});
    }

    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !this.layoutState().overlayMenuActive }));

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
        } else {
            this.layoutState.update((prev) => ({ ...prev, staticMenuMobileActive: !this.layoutState().staticMenuMobileActive }));

            if (this.layoutState().staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }
}
