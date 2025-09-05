import { Component, computed, input, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';
export type LoveLanguageStatistics = {
  topLanguages: LoveLanguage[];
  gender: 'male' | 'female';
};

@Component({
  selector: 'app-love-statistics',
  imports: [BaseChartDirective],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
})
export class LoveStatistics implements OnInit {
  public data = input<LoveLanguageStatistics[]>([]);

  private loveLanguageMap: Record<LoveLanguage, string> = {} as any;

  public barData = signal<ChartConfiguration<'bar'>['data']>({} as any);

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        align: 'end',
      },
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
      x: {},
      y: {
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
        min: 0,
        suggestedMax: 60,
      },
    },
  };

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();

      this.barData.set(this.mapLoveStatisticsBarData());
    });
    this.loadTranslations();
  }

  public ngOnInit(): void {
    this.barData.set(this.mapLoveStatisticsBarData());
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

    const labels = Object.keys(counts).map((l) => this.loveLanguageMap[l as LoveLanguage]);
    const categories = Object.keys(counts) as LoveLanguage[];

    // total counts for each gender
    const totalMale = categories.reduce((sum, cat) => sum + counts[cat].male, 0);
    const totalFemale = categories.reduce((sum, cat) => sum + counts[cat].female, 0);

    // percentage split per category
    const maleData = categories.map((cat) =>
      totalMale > 0 ? Math.round((counts[cat].male / totalMale) * 100) : 0
    );

    const femaleData = categories.map((cat) =>
      totalFemale > 0 ? Math.round((counts[cat].female / totalFemale) * 100) : 0
    );

    return {
      labels: labels,
      datasets: [
        {
          data: maleData, //Object.values(counts).map((c) => c.male),
          label: this.translate.instant('PROFILE_PAGE.MALE'),
        },
        {
          data: femaleData, //Object.values(counts).map((c) => c.female),
          label: this.translate.instant('PROFILE_PAGE.FEMALE'),
        },
      ],
    };
  }
}
