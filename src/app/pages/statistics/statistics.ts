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
    { route: 'iq', label: 'IQ Scores', icon: 'pi pi-wave-pulse' },
    { route: 'sociotype', label: 'Sociotypes', icon: 'pi pi-users' },
    { route: 'love', label: 'Love Languages', icon: 'pi pi-heart' },
  ];
}
