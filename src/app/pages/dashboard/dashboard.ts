import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subject, takeUntil } from 'rxjs';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-dashboard',
  imports: [Avatar, ButtonModule, Message],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnDestroy {
  public authService = inject(AuthService);
  private router = inject(Router);

  public init = signal<boolean>(true);
  public canTakeTest = signal<boolean>(false);
  public countdown = signal<string>('');
  private timerId: any;

  public items = ['IQ Test', 'Sociotype Test', 'Love language test', 'Coming soon'];

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

  public navigateToIqTest(): void {
    this.router.navigate(['iq-test']);
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
