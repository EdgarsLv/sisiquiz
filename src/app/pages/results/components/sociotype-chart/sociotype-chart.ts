import { Component, computed, input, OnInit, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SocionicType } from '../../../sociotype-statistics/sociotype-statistics';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type TSociotype = {
  percentages: Record<Dichotomy, number>;
  type: string;
};

export const typeNameMap: Record<SocionicType, string> = {
  ISTJ: 'RESULTS_PAGE.ISTJ_NAME',
  ISFJ: 'RESULTS_PAGE.ISFJ_NAME',
  INFJ: 'RESULTS_PAGE.INFJ_NAME',
  INTJ: 'RESULTS_PAGE.INTJ_NAME',
  ISTP: 'RESULTS_PAGE.ISTP_NAME',
  ISFP: 'RESULTS_PAGE.ISFP_NAME',
  INFP: 'RESULTS_PAGE.INFP_NAME',
  INTP: 'RESULTS_PAGE.INTP_NAME',
  ESTP: 'RESULTS_PAGE.ESTP_NAME',
  ESFP: 'RESULTS_PAGE.ESFP_NAME',
  ENFP: 'RESULTS_PAGE.ENFP_NAME',
  ENTP: 'RESULTS_PAGE.ENTP_NAME',
  ESTJ: 'RESULTS_PAGE.ESTJ_NAME',
  ESFJ: 'RESULTS_PAGE.ESFJ_NAME',
  ENFJ: 'RESULTS_PAGE.ENFJ_NAME',
  ENTJ: 'RESULTS_PAGE.ENTJ_NAME',
};

@Component({
  selector: 'app-sociotype-chart',
  imports: [BaseChartDirective, TranslatePipe],
  templateUrl: './sociotype-chart.html',
  styleUrl: './sociotype-chart.scss',
})
export class SociotypeChart implements OnInit {
  public sociotype = input.required<TSociotype>();

  private dichotomyMap: Record<Dichotomy, string> = {} as any;

  public sociotypeName = computed(() => typeNameMap[this.sociotype().type as SocionicType]);
  // public barData = computed<ChartConfiguration<'bar'>['data']>(() => this.mapSociotypeToBarData());

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
        title: { display: false, text: 'Personality traits' },
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

      this.barData.set(this.mapSociotypeToBarData());
    });
    this.loadTranslations();
  }

  public ngOnInit(): void {
    this.barData.set(this.mapSociotypeToBarData());
  }

  private loadTranslations() {
    this.dichotomyMap = {
      E: this.translate.instant('RESULTS_PAGE.EXTRAVERTED'),
      I: this.translate.instant('RESULTS_PAGE.INTROVERTED'),
      S: this.translate.instant('RESULTS_PAGE.SENSING'),
      N: this.translate.instant('RESULTS_PAGE.INTUITIVE'),
      T: this.translate.instant('RESULTS_PAGE.THINKING'),
      F: this.translate.instant('RESULTS_PAGE.FEELING'),
      J: this.translate.instant('RESULTS_PAGE.JUDGING'),
      P: this.translate.instant('RESULTS_PAGE.PERCEIVING'),
    };
  }

  private mapSociotypeToBarData(): ChartConfiguration<'bar'>['data'] {
    const sociotype = this.sociotype().percentages;
    const type = this.sociotype().type;

    const labels = (Object.keys(sociotype) as Dichotomy[]).map((d) => this.dichotomyMap[d]);
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
}
