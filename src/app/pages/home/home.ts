import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeroImage } from '../../components/hero-image/hero-image';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, HeroImage, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public authService = inject(AuthService);
  public router = inject(Router);

  private user = this.authService.authUser;
  private profile = this.authService.profile;

  public startTest(): void {
    if (!this.user()) {
      this.router.navigate(['login']);
      return;
    }

    if (!this.profile()) {
      this.router.navigate(['profile']);
      return;
    }

    this.router.navigate(['test-list']);
  }
}
