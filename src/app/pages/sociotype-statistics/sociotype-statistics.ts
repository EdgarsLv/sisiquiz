import { Component, computed, input } from '@angular/core';
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

export const typeMap: Record<SocionicType, string> = {
  ISTJ: 'Inspector',
  ISFJ: 'Protector',
  INFJ: 'Advocate',
  INTJ: 'Mastermind',
  ISTP: 'Crafter',
  ISFP: 'Artist',
  INFP: 'Mediator',
  INTP: 'Thinker',
  ESTP: 'Dynamo',
  ESFP: 'Performer',
  ENFP: 'Campaigner',
  ENTP: 'Visionary',
  ESTJ: 'Supervisor',
  ESFJ: 'Provider',
  ENFJ: 'Teacher',
  ENTJ: 'Commander',
};

export const socionicsNameMap: Record<SocionicType, string> = {
  ISTJ: 'Maxim Gorky',
  ISFJ: 'Dumas',
  INFJ: 'Dostoevsky',
  INTJ: 'Balzac',
  ISTP: 'Gabin',
  ISFP: 'Dreiser',
  INFP: 'Yesenin',
  INTP: 'Robespierre',
  ESTP: 'Zhukov',
  ESFP: 'Napoleon',
  ENFP: 'Huxley',
  ENTP: 'Don Quixote',
  ESTJ: 'Stierlitz',
  ESFJ: 'Hugo',
  ENFJ: 'Hamlet',
  ENTJ: 'Jack London',
};

@Component({
  selector: 'app-sociotype-statistics',
  imports: [BaseChartDirective],
  templateUrl: './sociotype-statistics.html',
  styleUrl: './sociotype-statistics.scss',
})
export class SociotypeStatistics {
  public data = input<SociotypeStatisticResults[]>([]);

  public barData = computed<ChartConfiguration<'bar'>['data']>(() =>
    this.mapLoveStatisticsBarData()
  );

  public socionicsList = Object.keys(typeMap).map((key) => {
    const socionicType = key as SocionicType;
    return {
      type: socionicType, // e.g. "ESFJ"
      title: typeMap[socionicType], // e.g. "Provider"
      socionicsName: socionicsNameMap[socionicType], // e.g. "Hugo"
    };
  });

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

    const labels = Object.keys(counts).map((l) => typeMap[l as SocionicType]);
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
          label: 'Male',
        },
        {
          data: femaleData, //Object.values(counts).map((c) => c.female),
          label: 'Female',
        },
      ],
    };
  }
}
