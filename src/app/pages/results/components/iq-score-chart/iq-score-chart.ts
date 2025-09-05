import { Component, input, OnInit, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TTestResult } from '../../results';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-iq-score-chart',
  imports: [BaseChartDirective, TranslatePipe],
  templateUrl: './iq-score-chart.html',
  styleUrl: './iq-score-chart.scss',
})
export class IqScoreChart implements OnInit {
  public results = input.required<TTestResult[]>();
  public lastScore = input<number>();

  // public lineData = computed<ChartConfiguration<'line'>['data']>(() => this.mapResultsToLineData());
  public lineData = signal<ChartConfiguration<'line'>['data']>({} as any);

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
          text: 'IQ',
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
        ticks: {
          callback: function (value) {
            return value + ' min';
          },
        },
        suggestedMin: 5,
        suggestedMax: 30,
      },
    },
  };

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.lineData.set(this.mapResultsToLineData());
    });
  }

  public ngOnInit(): void {
    this.lineData.set(this.mapResultsToLineData());
  }

  private mapResultsToLineData(): ChartConfiguration<'line'>['data'] {
    const labels = this.results().map((r) => new Date(r.date).toLocaleDateString());
    const score = this.results().map((r) => r.score);
    const time = this.results().map((r) => Math.ceil(r.timeSpent / 60));

    return {
      labels: labels,
      datasets: [
        {
          label: this.translate.instant('RESULTS_PAGE.SCORE'),
          data: score,
          borderColor: 'blue',
          yAxisID: 'y',
        },
        {
          label: this.translate.instant('RESULTS_PAGE.COMPLETION_TIME'),
          data: time,
          borderColor: 'green',
          yAxisID: 'y1',
        },
      ],
    };
  }
}
