import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, PasswordModule, InputTextModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authService = inject(AuthService);
  private router = inject(Router);

  public async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleSignIn();

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
    }
  }
}
