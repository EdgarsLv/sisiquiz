import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsWidget } from '../../components/stats-widget/stats-widget';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SociotypeChart } from './components/sociotype-chart/sociotype-chart';
import { IqScoreChart } from './components/iq-score-chart/iq-score-chart';
import { LoveTestResults } from '../love-test/love-test';

type TestStats = {
  average: number;
  highest: number;
  lowest: number;
  totalTests: number;
  averageTime: number;
  currentScore: number;
};

export type TTestResult = {
  score: number;
  timeSpent: number;
  date: string;
  id: string;
};

type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type TSociotype = {
  percentages: Record<Dichotomy, number>;
  type: string;
};

const defaultStats: TestStats = {
  average: 0,
  highest: 0,
  lowest: 0,
  totalTests: 0,
  averageTime: 0,
  currentScore: 0,
};

@Component({
  selector: 'app-results',
  imports: [
    CommonModule,
    StatsWidget,
    ButtonModule,
    ProgressBarModule,
    AvatarModule,
    TagModule,
    SociotypeChart,
    IqScoreChart,
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public stats = computed<TestStats>(() => {
    if (this.results().length === 0) {
      return defaultStats;
    }
    return this.getStats();
  });
  public curretLevel = computed(() => this.getCurrentLevel());
  public consistency = computed(() => this.getConsistency());

  public results = signal<TTestResult[]>([]);
  public sociotype = signal<TSociotype | undefined>(undefined);
  public loveResults = signal<LoveTestResults | undefined>(undefined);

  public lastResultId = computed(() => this.results().at(-1)?.id || null);

  public user = this.authService.authUser;

  public ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.results.set(data['data'] || []);
      this.sociotype.set(data['mbti']);
      this.loveResults.set(data['love']);
      console.log('love', data['love']);
    });
  }

  public goToShareScreen(): void {
    this.router.navigate(['/result', this.lastResultId()], { state: { owner: true } });
  }

  public timeInMinutes(result: TTestResult): number {
    return Math.round(result.timeSpent / 60);
  }

  private getConsistency(): string {
    return Math.abs(this.stats().highest - this.stats().lowest) <= 10
      ? 'Very High'
      : Math.abs(this.stats().highest - this.stats().lowest) <= 20
      ? 'High'
      : Math.abs(this.stats().highest - this.stats().lowest) <= 30
      ? 'Moderate'
      : 'Variable';
  }

  private getCurrentLevel(): string {
    return this.stats().average >= 130
      ? 'Exceptional'
      : this.stats().average >= 115
      ? 'Above Average'
      : this.stats().average >= 100
      ? 'Average'
      : this.stats().average >= 85
      ? 'Below Average'
      : 'Low';
  }

  private getStats(): TestStats {
    const result = this.results() || [];

    const scores = result.map((r) => r.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const currentScore = result.at(-1)?.score ?? 0;
    const maxScore = Math.max(0, ...scores);
    const minScore = Math.min(...scores);
    const totalTime = result.reduce((sum, r) => sum + r.timeSpent, 0);
    const avgTime = Math.round(totalTime / result.length / 60);

    const stats = {
      currentScore,
      average: avgScore,
      highest: maxScore,
      lowest: minScore,
      totalTests: result.length,
      averageTime: avgTime,
    };

    return stats;
  }

  public progressWidth(result: TTestResult): any {
    return `${Math.min((result.score / 150) * 100, 100)}`;
  }

  public getScoreLevel(score: number): string {
    if (score >= 130) return 'purple';
    if (score >= 115) return 'blue';
    if (score >= 100) return 'green';
    if (score >= 85) return 'orange';
    return 'red';
  }
}
