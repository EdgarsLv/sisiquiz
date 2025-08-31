import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  Inject,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { Logo } from '../../../components/logo/logo';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, PopoverModule, StyleClassModule, ButtonModule, Logo],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isAuthenticated = computed<boolean>(() => !!this.authService.authUser());
  public isAuthenticatedWithProfile = computed<boolean>(
    () => !!this.authService.authUser() && !!this.authService.profile()
  );

  @ViewChild('op') op!: Popover;

  items: any[] = [];

  private isBrowser: boolean;
  public isDark = true;

  @ViewChild('menuOverlay') menuOverlay!: ElementRef;
  @ViewChild('menuLinks') menuLinks!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;

  private menuTl!: gsap.core.Timeline;
  private menuOpen = false;
  public currentPreview = signal<string | null>(null);

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

  ngAfterViewInit() {
    const menu = this.menuOverlay.nativeElement;
    const links = this.menuLinks.nativeElement.querySelectorAll('a');

    this.menuTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power4.inOut' },
      onReverseComplete: () => {
        menu.style.visibility = 'hidden';
      },
    });

    this.menuTl
      // Curtain reveal
      .fromTo(
        menu,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 0.6,
          onStart: () => {
            menu.style.visibility = 'visible';
            this.setPreviewForCurrentRoute();
          },
        } // 👈 make sure visible every time
      )
      // Links animation
      .fromTo(
        links,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      );
  }

  public setPreviewForCurrentRoute() {
    // const url = this.router.url.split('?')[0];
    // const preview = this.routePreviews[url];
    const preview = 'assets/logo/account.svg';
    if (preview) {
      this.currentPreview.set(preview);
      setTimeout(() => {
        if (this.previewImage) {
          // gsap.set(this.previewImage.nativeElement, { opacity: 1 });
          gsap.fromTo(
            this.previewImage.nativeElement,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: 'power2.out', delay: 0.5 }
          );
        }
      });
    }
  }

  toggleMenu() {
    if (!this.menuOpen) {
      this.menuTl.play();
    } else {
      this.menuTl.reverse();
    }
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    if (!this.menuOpen) return;
    const menu = this.menuOverlay.nativeElement;
    const links = this.menuLinks.nativeElement.querySelectorAll('a');

    // Immediately hide menu without animation
    gsap.killTweensOf([menu, links]); // cancel any running animations
    gsap.set(menu, { scaleY: 0, visibility: 'hidden' });
    gsap.set(links, { opacity: 0, y: 30 });

    // Reset timeline so next open works correctly
    this.menuTl.progress(0).pause();
    this.menuOpen = false;
  }

  showPreview(image: string) {
    this.currentPreview.set(image);
    setTimeout(() => {
      if (this.previewImage) {
        gsap.fromTo(
          this.previewImage.nativeElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'power2.out' }
        );
      }
    });
  }

  hidePreview() {
    if (this.previewImage) {
      gsap.to(this.previewImage.nativeElement, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.currentPreview.set(null);
        },
      });
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
      {
        label: 'View Tests',
        icon: 'pi pi-sparkles',
        link: 'test-list',
      },
      {
        label: 'View Results',
        icon: 'pi pi-chart-bar',
        link: 'results',
      },
      {
        label: 'View Statistics',
        icon: 'pi pi-chart-scatter',
        link: 'statistics/iq',
      },
    ];
  }

  public toggleDarkMode() {
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
