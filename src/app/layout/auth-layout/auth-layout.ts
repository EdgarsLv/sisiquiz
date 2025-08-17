import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Header, Footer, ProgressBarModule, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private loaderService = inject(LoaderService);

  public loader$ = this.loaderService.loading$;
}
