import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Logo } from '../../components/logo/logo';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, PasswordModule, InputTextModule, FormsModule, Logo],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authService = inject(AuthService);
  private router = inject(Router);

  public async loginWithGoogle(): Promise<void> {
    try {
      await this.authService
        .googleSignIn()
        .then(() => this.router.navigate(['/profile']));
    } catch (err) {
      console.error('Login error:', err);
    }
  }
}
