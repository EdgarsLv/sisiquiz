import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-statistics',
  imports: [TabsModule, RouterOutlet, RouterLink, TranslatePipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public activeTab = signal<string>('iq');

  public tabs = [
    {
      route: 'iq',
      label: 'STATISTICS_PAGE.SCORES',
      icon: 'pi pi-wave-pulse',
    },
    {
      route: 'sociotype',
      label: 'STATISTICS_PAGE.SOCIOTYPES',
      icon: 'pi pi-users',
    },
    {
      route: 'love',
      label: 'STATISTICS_PAGE.LOVE_LANGUAGES',
      icon: 'pi pi-heart',
    },
  ];

  public ngOnInit() {
    this.router.events.subscribe(() => {
      const current = this.route.firstChild?.snapshot.url[0]?.path;
      if (current) {
        this.activeTab.set(current);
      }
    });
  }
}
