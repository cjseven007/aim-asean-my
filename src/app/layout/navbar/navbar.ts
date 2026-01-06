import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  open = signal(false);

  navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Courses', path: '/courses' },
    { label: 'AI Tools', path: '/tools' },
    { label: 'About', path: '/about' },
  ];

  // Expose auth state to template
  user$;   // <-- declare only

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;   // <-- initialize here
  }

  async onLogin() {
    await this.auth.signInWithGoogle();
  }
}
