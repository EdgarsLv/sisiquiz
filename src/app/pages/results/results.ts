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

  public results = signal<TTestResult[]>([]);
  public sociotype = signal<TSociotype | undefined>(undefined);

  public lastResultId = computed(() => this.results().at(-1)?.id || null);

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
          text: 'Time (min)',
        },
        suggestedMin: 5,
        suggestedMax: 30,
      },
    },
  };

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            // context.label is your dichotomy (E, I, S, etc.)
            // context.parsed.y or .parsed.x (depending on chart type) is the value
            // const label = context.label || '';
            const value = context.parsed.y ?? context.parsed.x;
            return ` ${value} %`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Personality traits' },
      },
      y: {
        title: { display: true, text: 'Percentage' },
        min: 0,
        max: 100,
      },
    },
  };

  public lineData = computed<ChartConfiguration<'line'>['data']>(() => this.mapResultsToLineData());
  public barData = computed<ChartConfiguration<'bar'>['data']>(() => this.mapSociotypeToBarData());

  public ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.results.set(data['data'] || []);
      this.sociotype.set(data['sociotype']?.sociotype);
    });
  }

  private mapSociotypeToBarData(): ChartConfiguration<'bar'>['data'] {
    const sociotype = this.sociotype()!.percentages;
    const type = this.sociotype()!.type;

    const labels = Object.keys(sociotype);
    const data = Object.values(sociotype);

    return {
      labels,
      datasets: [
        {
          label: type,
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // red
            'rgba(255, 159, 64, 0.2)', // orange
            'rgba(255, 205, 86, 0.2)', // yellow
            'rgba(75, 192, 192, 0.2)', // teal
            'rgba(54, 162, 235, 0.2)', // blue
            'rgba(153, 102, 255, 0.2)', // purple
            'rgba(0, 200, 83, 0.2)', // green (replacement for gray)
            'rgba(233, 30, 99, 0.2)', // pink/magenta
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(0, 200, 83)',
            'rgb(233, 30, 99)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  private mapResultsToLineData(): ChartConfiguration<'line'>['data'] {
    const labels = this.results().map((r) => new Date(r.date).toLocaleDateString());
    const score = this.results().map((r) => r.score);
    const time = this.results().map((r) => Math.ceil(r.timeSpent / 60));

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
          label: 'Completion Time (min)',
          data: time,
          borderColor: 'green',
          yAxisID: 'y1',
        },
      ],
    };
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
