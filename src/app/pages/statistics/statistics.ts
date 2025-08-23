import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-statistics',
  imports: [TabsModule, RouterOutlet, RouterLink],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  public tabs = [
    { route: 'iq-statistics', label: 'IQ Scores', icon: 'pi pi-home' },
    { route: 'sociotype-statistics', label: 'Sociotypes', icon: 'pi pi-chart-line' },
    { route: 'love-statistics', label: 'Love Languages', icon: 'pi pi-list' },
  ];
}
