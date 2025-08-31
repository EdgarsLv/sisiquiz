import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
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
import { Logo } from '../../../components/logo/logo';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, StyleClassModule, ButtonModule, Logo],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isAuthenticated = computed<boolean>(() => !!this.authService.authUser());
  public isAuthenticatedWithProfile = computed<boolean>(
    () => !!this.authService.authUser() && !!this.authService.profile()
  );

  private isBrowser: boolean;
  public isDark = true;

  @ViewChild('menuOverlay') menuOverlay!: ElementRef;
  @ViewChild('menuLinks') menuLinks!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;

  private menuTl!: gsap.core.Timeline;
  public menuOpen = false;
  public currentPreview = signal<string | null>(null);

  private routePreviews: Record<string, string> = {
    '/': 'assets/logo/mindmap.svg',
    '/profile': 'assets/logo/account.svg',
    '/test-list': 'assets/logo/online.svg',
    '/results': 'assets/logo/analysis.svg',
    '/statistics/iq': 'assets/logo/statistics.svg',
  };

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

  public ngAfterViewInit() {
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
    const url = this.router.url.split('?')[0];
    const preview = this.routePreviews[url];

    if (preview) {
      this.currentPreview.set(preview);
      setTimeout(() => {
        if (this.previewImage) {
          gsap.fromTo(
            this.previewImage.nativeElement,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: 'power2.in', delay: 0.5 }
          );
        }
      });
    }
  }

  public toggleMenu() {
    if (!this.menuOpen) {
      this.menuTl.play();
    } else {
      this.menuTl.reverse();
      gsap.to(this.previewImage.nativeElement, {
        opacity: 0,
        duration: 0.3,
        delay: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          this.currentPreview.set(null);
        },
      });
    }
    this.menuOpen = !this.menuOpen;
  }

  public closeMenu() {
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

  public showPreview(image: string) {
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

  public hidePreview() {
    const url = this.router.url.split('?')[0];
    const preview = this.routePreviews[url];

    if (preview) {
      this.currentPreview.set(preview);
    }
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
