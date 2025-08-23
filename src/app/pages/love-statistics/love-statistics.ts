import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';
export type LoveLanguageStatistics = {
  topLanguages: LoveLanguage[];
  gender: 'male' | 'female';
};

const loveLanguageMap: Record<LoveLanguage, string> = {
  words: 'Words of Affirmation',
  acts: 'Acts of Service',
  gifts: 'Receiving Gifts',
  quality: 'Quality Time',
  touch: 'Physical Touch',
};

@Component({
  selector: 'app-love-statistics',
  imports: [BaseChartDirective],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
})
export class LoveStatistics {
  public data = input<LoveLanguageStatistics[]>([]);

  public barData = computed<ChartConfiguration<'bar'>['data']>(() =>
    this.mapLoveStatisticsBarData()
  );

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {},
      y: { min: 0, suggestedMax: 10 },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  private mapLoveStatisticsBarData(): ChartConfiguration<'bar'>['data'] {
    const counts: Record<LoveLanguage, { male: number; female: number }> = {
      words: { male: 0, female: 0 },
      acts: { male: 0, female: 0 },
      gifts: { male: 0, female: 0 },
      quality: { male: 0, female: 0 },
      touch: { male: 0, female: 0 },
    };

    for (const stat of this.data()) {
      for (const lang of stat.topLanguages) {
        counts[lang][stat.gender] += 1;
      }
    }

    const labels = Object.keys(counts).map((l) => loveLanguageMap[l as LoveLanguage]);

    return {
      labels: labels,
      datasets: [
        {
          data: Object.values(counts).map((c) => c.male),
          label: 'Male',
        },
        {
          data: Object.values(counts).map((c) => c.female),
          label: 'Female',
        },
      ],
    };
  }
}
