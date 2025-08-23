import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TTestResult } from '../../results';

@Component({
  selector: 'app-iq-score-chart',
  imports: [BaseChartDirective],
  templateUrl: './iq-score-chart.html',
  styleUrl: './iq-score-chart.scss',
})
export class IqScoreChart {
  public results = input.required<TTestResult[]>();

  public lineData = computed<ChartConfiguration<'line'>['data']>(() => this.mapResultsToLineData());

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
}
