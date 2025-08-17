import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsWidget } from '../../components/stats-widget/stats-widget';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

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
    BaseChartDirective,
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

  public resultId = signal<string | null>(null);
  public results = signal<TTestResult[]>([]);

  public user = this.authService.authUser;

  public lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { align: 'end' },
    },

    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Score',
        },
        suggestedMin: 60,
        suggestedMax: 150,
        min: 60,
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Time (sec)',
        },
      },
    },
  };

  public lineData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.mapResultsToLineData()
  );

  public ngOnInit(): void {
    const resultId = window.localStorage.getItem('testResultId');
    this.resultId.set(resultId);

    this.activatedRoute.data.subscribe((data) => {
      this.results.set(data['data'] || []);
    });
  }

  private mapResultsToLineData(): ChartConfiguration<'line'>['data'] {
    const labels = this.results().map((r) =>
      new Date(r.date).toLocaleDateString()
    );
    const score = this.results().map((r) => r.score);
    const time = this.results().map((r) => r.timeSpent);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Score',
          data: score,
          borderColor: 'blue',
          yAxisID: 'y',
        },
        {
          label: 'Completion Time (sec)',
          data: time,
          borderColor: 'green',
          yAxisID: 'y1',
        },
      ],
    };
  }

  public goToShareScreen(): void {
    this.router.navigate(['/result', this.resultId()]);
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
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
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
      averageTime: Math.ceil(avgTime / 60),
    };

    return stats;
  }

  public progressWidth(result: TTestResult): any {
    return `${Math.min((result.score / 150) * 100, 100)}`;
  }

  public getScoreColor(score: number): string {
    if (score >= 130) return 'contrast';
    if (score >= 115) return 'info';
    if (score >= 100) return 'success';
    if (score >= 85) return 'warn';
    return 'danger';
  }

  public getScoreLevel(score: number): string {
    if (score >= 130) return 'purple';
    if (score >= 115) return 'blue';
    if (score >= 100) return 'green';
    if (score >= 85) return 'orange';
    return 'red';
  }

  public getScoreGradient(score: number): string {
    if (score >= 130) return 'bg-gradient-to-r from-purple-600 to-pink-600';
    if (score >= 115) return 'bg-gradient-to-r from-blue-600 to-cyan-600';
    if (score >= 100) return 'bg-gradient-to-r from-green-600 to-emerald-600';
    if (score >= 85) return 'bg-gradient-to-r from-yellow-600 to-orange-600';
    return 'bg-gradient-to-r from-red-600 to-rose-600';
  }
}
