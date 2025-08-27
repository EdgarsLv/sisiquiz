import { Component, computed, input, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  socionicsNameMap,
  SocionicType,
  typeMap,
} from '../../../sociotype-statistics/sociotype-statistics';

type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type TSociotype = {
  percentages: Record<Dichotomy, number>;
  type: string;
};

const dichotomyMap: Record<Dichotomy, string> = {
  E: 'Extraverted',
  I: 'Introverted',
  S: 'Sensing',
  N: 'Intuitive',
  T: 'Thinking',
  F: 'Feeling',
  J: 'Judging',
  P: 'Perceiving',
};

@Component({
  selector: 'app-sociotype-chart',
  imports: [BaseChartDirective],
  templateUrl: './sociotype-chart.html',
  styleUrl: './sociotype-chart.scss',
})
export class SociotypeChart {
  public sociotype = input.required<TSociotype>();

  public socionicType = computed(() => typeMap[this.sociotype().type as SocionicType]);
  public sociotypeCode = computed(() => socionicsNameMap[this.sociotype().type as SocionicType]);
  public barData = computed<ChartConfiguration<'bar'>['data']>(() => this.mapSociotypeToBarData());

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

  private mapSociotypeToBarData(): ChartConfiguration<'bar'>['data'] {
    const sociotype = this.sociotype().percentages;
    const type = this.sociotype().type;

    const labels = (Object.keys(sociotype) as Dichotomy[]).map((d) => dichotomyMap[d]);
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
