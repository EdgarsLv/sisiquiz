import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  Inject,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { Logo } from '../../../components/logo/logo';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    PopoverModule,
    StyleClassModule,
    ButtonModule,
    Logo,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isAuthenticated = computed<boolean>(
    () => !!this.authService.authUser()
  );
  public isAuthenticatedWithProfile = computed<boolean>(
    () => !!this.authService.authUser() && !!this.authService.profile()
  );

  @ViewChild('op') op!: Popover;

  items: any[] = [];

  private isBrowser: boolean;
  public isDark = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.isDark = window.localStorage.getItem('theme') === 'app-dark';
      if (this.isDark) {
        document.documentElement.classList.add('app-dark');
        window.localStorage.setItem('theme', 'app-dark');
      }
    }
  }

  public toggle(event: any) {
    this.op.toggle(event);
  }

  public close(): void {
    this.op.hide();
  }

  public ngOnInit() {
    this.items = [
      // {
      //   label: 'IQ Test',
      //   icon: 'pi pi-clock',
      //   link: 'test',
      // },
      {
        label: 'Start Test',
        icon: 'pi pi-clock',
        link: 'iq-test',
      },
      {
        label: 'View Results',
        icon: 'pi pi-chart-bar',
        link: 'results',
      },
      {
        label: 'View Statistics',
        icon: 'pi pi-chart-scatter',
        link: 'statistics',
      },
    ];
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('app-dark');
      window.localStorage.setItem('theme', 'app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
      window.localStorage.removeItem('theme');
    }
  }

  public signOut(): void {
    this.authService.signOut().then(() => this.router.navigate(['/']));
  }
}
