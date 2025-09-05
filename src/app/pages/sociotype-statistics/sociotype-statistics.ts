import { Component, computed, input, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export type SocionicType =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ';

export type SociotypeStatisticResults = {
  type: SocionicType;
  gender: 'male' | 'female';
};

// export const typeMap: Record<SocionicType, string> = {
//   ISTJ: 'Inspector',
//   ISFJ: 'Protector',
//   INFJ: 'Advocate',
//   INTJ: 'Mastermind',
//   ISTP: 'Crafter',
//   ISFP: 'Artist',
//   INFP: 'Mediator',
//   INTP: 'Thinker',
//   ESTP: 'Dynamo',
//   ESFP: 'Performer',
//   ENFP: 'Campaigner',
//   ENTP: 'Visionary',
//   ESTJ: 'Supervisor',
//   ESFJ: 'Provider',
//   ENFJ: 'Teacher',
//   ENTJ: 'Commander',
// };

@Component({
  selector: 'app-sociotype-statistics',
  imports: [BaseChartDirective],
  templateUrl: './sociotype-statistics.html',
  styleUrl: './sociotype-statistics.scss',
})
export class SociotypeStatistics implements OnInit {
  public data = input<SociotypeStatisticResults[]>([]);

  private sociotypeNameMap: Record<SocionicType, string> = {} as any;

  public barData = signal<ChartConfiguration<'bar'>['data']>({} as any);

  // public socionicsList = Object.keys(typeMap).map((key) => {
  //   const socionicType = key as SocionicType;
  //   return {
  //     type: socionicType,
  //     title: typeMap[socionicType],
  //     socionicsName: socionicsNameMap[socionicType],
  //   };
  // });

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
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
            const value = context.parsed.x ?? context.parsed.x;
            return ` ${value} %`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
        min: 0,
        suggestedMax: 60,
      },
      y: {},
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
    this.sociotypeNameMap = {
      ISTJ: this.translate.instant('RESULTS_PAGE.ISTJ_NAME'),
      ISFJ: this.translate.instant('RESULTS_PAGE.ISFJ_NAME'),
      INFJ: this.translate.instant('RESULTS_PAGE.INFJ_NAME'),
      INTJ: this.translate.instant('RESULTS_PAGE.INTJ_NAME'),
      ISTP: this.translate.instant('RESULTS_PAGE.ISTP_NAME'),
      ISFP: this.translate.instant('RESULTS_PAGE.ISFP_NAME'),
      INFP: this.translate.instant('RESULTS_PAGE.INFP_NAME'),
      INTP: this.translate.instant('RESULTS_PAGE.INTP_NAME'),
      ESTP: this.translate.instant('RESULTS_PAGE.ESTP_NAME'),
      ESFP: this.translate.instant('RESULTS_PAGE.ESFP_NAME'),
      ENFP: this.translate.instant('RESULTS_PAGE.ENFP_NAME'),
      ENTP: this.translate.instant('RESULTS_PAGE.ENTP_NAME'),
      ESTJ: this.translate.instant('RESULTS_PAGE.ESTJ_NAME'),
      ESFJ: this.translate.instant('RESULTS_PAGE.ESFJ_NAME'),
      ENFJ: this.translate.instant('RESULTS_PAGE.ENFJ_NAME'),
      ENTJ: this.translate.instant('RESULTS_PAGE.ENTJ_NAME'),
    };
  }

  private mapLoveStatisticsBarData(): ChartConfiguration<'bar'>['data'] {
    const counts: Record<SocionicType, { male: number; female: number }> = {
      INFJ: { male: 0, female: 0 },
      INFP: { male: 0, female: 0 },
      INTJ: { male: 0, female: 0 },
      INTP: { male: 0, female: 0 },
      ISFJ: { male: 0, female: 0 },
      ISFP: { male: 0, female: 0 },
      ISTJ: { male: 0, female: 0 },
      ISTP: { male: 0, female: 0 },
      ENFJ: { male: 0, female: 0 },
      ENFP: { male: 0, female: 0 },
      ENTJ: { male: 0, female: 0 },
      ENTP: { male: 0, female: 0 },
      ESFJ: { male: 0, female: 0 },
      ESFP: { male: 0, female: 0 },
      ESTJ: { male: 0, female: 0 },
      ESTP: { male: 0, female: 0 },
    };

    for (const stat of this.data()) {
      counts[stat.type][stat.gender] += 1;
    }

    const labels = Object.keys(counts).map((l) => this.sociotypeNameMap[l as SocionicType]);
    const categories = Object.keys(counts) as SocionicType[];

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
