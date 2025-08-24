import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { interval, Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../services/storage.service';

type AvailableTests = {
  icon: string;
  name: string;
  description: string;
  link: string;
};

const tests: AvailableTests[] = [
  {
    icon: 'assets/logo/logic.svg',
    name: 'IQ Test',
    description: 'Challenge your brain with tricky logic and pattern puzzles.',
    link: 'iq-test',
  },
  {
    icon: 'assets/logo/lovelanguage.svg',
    name: 'Love Language Test',
    description: 'Find out how you love and want to be loved.',
    link: 'love-test',
  },
  {
    icon: 'assets/logo/personality.svg',
    name: 'Sociotype Test',
    description: 'Discover your personality blueprint and connection style.',
    link: 'sociotype-test',
  },
  {
    icon: 'assets/logo/process.svg',
    name: 'Coming Soon',
    description: 'New tests are on the way—stay tuned!',
    link: 'coming-soon',
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [Avatar, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnDestroy {
  private router = inject(Router);
  private storageService = inject(StorageService);

  public countdown = signal<string | null>(null);

  public availableTests = signal<AvailableTests[]>(tests);

  private destroy$ = new Subject<void>();

  constructor() {
    this.startCountdown();
  }

  private startCountdown(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const countdown = this.storageService.getCountdown('love');
        this.countdown.set(countdown);
      });
  }

  public navigateToTest(link: string): void {
    this.router.navigate([link]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
