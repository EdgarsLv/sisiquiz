import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { HeroImage } from '../../components/hero-image/hero-image';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, HeroImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  public authService = inject(AuthService);
  public router = inject(Router);

  public user = this.authService.authUser;

  public init = signal<boolean>(true);

  private destroy$ = new Subject<void>();

  constructor() {
    toObservable(this.authService.profile)
      .pipe(
        filter((val) => val !== null),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.init.set(false);
      });
  }

  public startTest(): void {
    this.router.navigate(['test-list']);
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleSignIn().then(() => this.router.navigate(['/profile']));
    } catch (err) {
      console.error('Login error:', err);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
