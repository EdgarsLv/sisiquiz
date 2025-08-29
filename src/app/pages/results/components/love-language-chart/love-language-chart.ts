import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LoveTestResults } from '../../../love-test/love-test';

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';

const loveLanguageMap: Record<LoveLanguage, string> = {
  words: 'Words of Affirmation',
  acts: 'Acts of Service',
  gifts: 'Receiving Gifts',
  quality: 'Quality Time',
  touch: 'Physical Touch',
};

@Component({
  selector: 'app-love-language-chart',
  imports: [BaseChartDirective],
  templateUrl: './love-language-chart.html',
  styleUrl: './love-language-chart.scss',
})
export class LoveLanguageChart {
  public loveLanguage = input.required<LoveTestResults>();

  public topLanguage = computed(
    () => loveLanguageMap[this.loveLanguage().topLanguages[0] as LoveLanguage]
  );
  public barData = computed<ChartConfiguration<'bar'>['data']>(() =>
    this.mapLoveLanguageToBarData()
  );

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
        title: { display: false, text: 'Love languages' },
      },
      y: {
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
        title: { display: false, text: 'Percentage' },
        min: 0,
        max: 100,
      },
    },
  };

  private mapLoveLanguageToBarData(): ChartConfiguration<'bar'>['data'] {
    const language = this.loveLanguage().percentages;
    const topLanguage = this.loveLanguage().topLanguages[0];

    const labels = Object.keys(language).map((key) => loveLanguageMap[key as LoveLanguage]);
    const data = Object.values(language);

    return {
      labels,
      datasets: [
        {
          label: topLanguage,
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // red
            'rgba(255, 159, 64, 0.2)', // orange
            'rgba(255, 205, 86, 0.2)', // yellow
            'rgba(75, 192, 192, 0.2)', // teal
            'rgba(54, 162, 235, 0.2)', // blue
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }
}
