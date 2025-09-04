import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { interval, Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { TranslatePipe } from '@ngx-translate/core';

type AvailableTests = {
  icon: string;
  name: string;
  description: string;
  link: string;
};

const tests: AvailableTests[] = [
  {
    icon: 'assets/logo/logic.svg',
    name: 'TEST_LIST.IQ_TEST_TITLE',
    description: 'TEST_LIST.IQ_TEST_TEXT',
    link: 'iq-test',
  },
  {
    icon: 'assets/logo/lovelanguage.svg',
    name: 'TEST_LIST.LOVE_TEST_TITLE',
    description: 'TEST_LIST.LOVE_TEST_TEXT',
    link: 'love-test',
  },
  {
    icon: 'assets/logo/personality.svg',
    name: 'TEST_LIST.SOCIOTYPE_TEST_TITLE',
    description: 'TEST_LIST.SOCIOTYPE_TEST_TEXT',
    link: 'sociotype-test',
  },
  {
    icon: 'assets/logo/process.svg',
    name: 'TEST_LIST.COMING_SOON_TITLE',
    description: 'TEST_LIST.COMING_SOON_TEXT',
    link: 'coming-soon',
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, TranslatePipe],
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
        const countdown = this.storageService.getCountdown('iq');
        this.countdown.set(countdown);

        if (countdown === null) {
          this.destroy$.next();
          this.destroy$.complete();
        }
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
