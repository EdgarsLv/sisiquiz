import { Component, computed, input, OnInit, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LoveTestResults } from '../../../love-test/love-test';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';

// const loveLanguageMap: Record<LoveLanguage, string> = {
//   words: 'Words of Affirmation',
//   acts: 'Acts of Service',
//   gifts: 'Receiving Gifts',
//   quality: 'Quality Time',
//   touch: 'Physical Touch',
// };

const loveNameMap: Record<LoveLanguage, string> = {
  words: 'RESULTS_PAGE.WORDS',
  acts: 'RESULTS_PAGE.ACTS',
  gifts: 'RESULTS_PAGE.GIFTS',
  quality: 'RESULTS_PAGE.TIME',
  touch: 'RESULTS_PAGE.TOUCH',
};

@Component({
  selector: 'app-love-language-chart',
  imports: [BaseChartDirective, TranslatePipe],
  templateUrl: './love-language-chart.html',
  styleUrl: './love-language-chart.scss',
})
export class LoveLanguageChart implements OnInit {
  public loveLanguage = input.required<LoveTestResults>();

  private loveLanguageMap: Record<LoveLanguage, string> = {} as any;

  public topLanguage = computed(
    () => loveNameMap[this.loveLanguage().topLanguages[0] as LoveLanguage]
  );
  // public barData = computed<ChartConfiguration<'bar'>['data']>(() =>
  //   this.mapLoveLanguageToBarData()
  // );
  public barData = signal<ChartConfiguration<'bar'>['data']>({} as any);

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

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();

      this.barData.set(this.mapLoveLanguageToBarData());
    });
    this.loadTranslations();
  }

  public ngOnInit(): void {
    this.barData.set(this.mapLoveLanguageToBarData());
  }

  private loadTranslations() {
    this.loveLanguageMap = {
      words: this.translate.instant('RESULTS_PAGE.WORDS'),
      acts: this.translate.instant('RESULTS_PAGE.ACTS'),
      quality: this.translate.instant('RESULTS_PAGE.TIME'),
      touch: this.translate.instant('RESULTS_PAGE.TOUCH'),
      gifts: this.translate.instant('RESULTS_PAGE.GIFTS'),
    };
  }

  private mapLoveLanguageToBarData(): ChartConfiguration<'bar'>['data'] {
    const language = this.loveLanguage().percentages;
    const topLanguage = this.loveLanguage().topLanguages[0];

    const labels = Object.keys(language).map((key) => this.loveLanguageMap[key as LoveLanguage]);
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
