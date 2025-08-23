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

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        align: 'end',
      },
    },
    scales: {
      x: {},
      y: { min: 0, suggestedMax: 10 },
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
