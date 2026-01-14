import { Component, HostListener,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { User as UserIcon, LogOut, Settings }from 'lucide-angular';
@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive,LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  open = signal(false);
  profileMenuOpen = signal(false);
  readonly icons = { UserIcon, LogOut, Settings };

  navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Courses', path: '/courses' },
    { label: 'AI Tools', path: '/tools' },
    { label: 'About', path: '/about' },
  ];

  // Expose auth state to template
  user$;   // <-- declare only

  constructor(private auth: AuthService,private router: Router) {
    this.user$ = this.auth.user$;   // <-- initialize here
  }

  async onLogin() {
    await this.auth.signInWithGoogle();
  }

  toggleProfileMenu() {
    this.profileMenuOpen.set(!this.profileMenuOpen());
  }

  closeProfileMenu() {
    this.profileMenuOpen.set(false);
  }

  goProfile() {
    this.closeProfileMenu();
    this.router.navigate(['/profile']);
  }

  async signOut() {
    this.closeProfileMenu();
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  // close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement | null;
    if (!target) return;

    // anything inside these containers should not close it
    if (target.closest('[data-profile-menu-root="true"]')) return;

    this.closeProfileMenu();
  }
}
