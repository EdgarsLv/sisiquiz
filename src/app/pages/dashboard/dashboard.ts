import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [Avatar, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);

  public items = ['IQ Test', 'Sociotype Test', 'Love language test', 'Coming soon'];

  public navigateToIqTest(): void {
    this.router.navigate(['iq-test']);
  }
}
