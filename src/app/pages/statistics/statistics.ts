import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type TStatistics = {
  id: string;
  gender: 'male' | 'female';
  age: number;
  score: number;
};

@Component({
  selector: 'app-statistics',
  imports: [BaseChartDirective],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  public data = input<TStatistics[]>([]);

  // scatter
  public scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { align: 'end' },
      tooltip: {
        callbacks: {
          //@ts-ignore
          label: (ctx) => `Age: ${ctx.raw.y}, Score: ${ctx.raw.x}`,
        },
      },
    },

    scales: {
      x: {
        title: { display: true, text: 'IQ Score' },
        suggestedMin: 60,
        suggestedMax: 140,
        min: 60,
      },
      y: {
        title: { display: true, text: 'Age' },
        suggestedMin: 10,
        suggestedMax: 100,
        min: 10,
      },
    },
  };

  public scatterData = computed<ChartConfiguration<'scatter'>['data']>(() =>
    this.mapStatisticsToDatasets(this.data())
  );

  private mapStatisticsToDatasets(stats: TStatistics[]) {
    const malePoints = stats
      .filter((d) => d.gender === 'male')
      .map((d) => ({ x: d.score, y: d.age }));

    const femalePoints = stats
      .filter((d) => d.gender === 'female')
      .map((d) => ({ x: d.score, y: d.age }));

    return {
      datasets: [
        {
          label: 'Male',
          data: malePoints,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          pointRadius: 5,
        },
        {
          label: 'Female',
          data: femalePoints,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          pointRadius: 5,
        },
      ],
    };
  }
}
