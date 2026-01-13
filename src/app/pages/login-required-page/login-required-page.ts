import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-login-required-page',
  imports: [CommonModule],
  templateUrl: './login-required-page.html',
  styleUrl: './login-required-page.css',
})
export class LoginRequiredPage {
  loading = false;
  error?: string;

  constructor(private auth: AuthService, private router: Router) {}

  async signIn() {
    this.loading = true;
    this.error = undefined;
    try {
      await this.auth.signInWithGoogle();
      // After sign in, user must complete profile first
      this.router.navigate(['/profile']);
    } catch (e) {
      console.error(e);
      this.error = 'Sign-in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
