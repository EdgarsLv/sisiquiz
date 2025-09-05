import { Component, input, signal, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type TStatistics = {
  id: string;
  gender: 'male' | 'female';
  age: number;
  score: number;
};

@Component({
  selector: 'app-iq-statistics',
  imports: [BaseChartDirective],
  templateUrl: './iq-statistics.html',
  styleUrl: './iq-statistics.scss',
})
export class IqStatistics implements OnInit {
  public data = input<TStatistics[]>([]);
  private translate = inject(TranslateService);

  public scatterData = signal<ChartConfiguration<'scatter'>['data']>({} as any);

  // scatter
  public scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { align: 'end' },
      tooltip: {
        callbacks: {
          //@ts-ignore
          label: (ctx: any) =>
            `${this.translate.instant('PROFILE_PAGE.AGE')}: ${ctx.raw.y}, IQ: ${ctx.raw.x}`,
        },
      },
    },

    scales: {
      x: {
        title: { display: true, text: 'IQ' },
        suggestedMin: 60,
        suggestedMax: 140,
        min: 60,
      },
      y: {
        title: { display: true, text: this.translate.instant('PROFILE_PAGE.AGE') },
        suggestedMin: 10,
        suggestedMax: 100,
        min: 10,
      },
    },
  };

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      this.scatterData.set(this.mapStatisticsToDatasets());
    });
  }

  public ngOnInit(): void {
    this.scatterData.set(this.mapStatisticsToDatasets());
  }

  private mapStatisticsToDatasets() {
    const malePoints = this.data()
      .filter((d) => d.gender === 'male')
      .map((d) => ({ x: d.score, y: d.age }));

    const femalePoints = this.data()
      .filter((d) => d.gender === 'female')
      .map((d) => ({ x: d.score, y: d.age }));

    return {
      datasets: [
        {
          label: this.translate.instant('PROFILE_PAGE.MALE'),
          data: malePoints,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          pointRadius: 5,
        },
        {
          label: this.translate.instant('PROFILE_PAGE.FEMALE'),
          data: femalePoints,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          pointRadius: 5,
        },
      ],
    };
  }
}
