import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { Message } from 'primeng/message';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, Message],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  public authService = inject(AuthService);
  public router = inject(Router);

  public user = this.authService.authUser;

  public init = signal<boolean>(true);
  public canTakeTest = signal<boolean>(false);
  public countdown = signal<string>('');
  private timerId: any;

  public countDownSubject$ = new BehaviorSubject<string | undefined>(undefined);
  private destroy$ = new Subject<void>();

  constructor() {
    toObservable(this.authService.profile)
      .pipe(
        filter((val) => val !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((time) => {
        this.init.set(false);
        if (time?.testTakenAt) {
          const date = time.testTakenAt;
          this.timerId = setInterval(() => this.updateCountdown(date), 1000);
        }
      });
  }

  public startTest(): void {
    this.router.navigate(['iq-test']);
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleSignIn().then(() => this.router.navigate(['/profile']));
    } catch (err) {
      console.error('Login error:', err);
    }
  }

  private updateCountdown(time: string): void {
    const now = new Date().getTime();
    const target = new Date(time).getTime() + 24 * 60 * 60 * 1000; // +24h
    const diff = target - now;

    if (diff <= 0) {
      this.canTakeTest.set(true);
      this.countdown.set('');
      clearInterval(this.timerId); // stop ticking
    } else {
      this.canTakeTest.set(false);
      this.countdown.set(this.formatTime(diff));
    }
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.timerId);
  }
}
