import { Component, signal } from '@angular/core';
import { Router,RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aim-asean');
  hideFooter = signal(false);

  constructor(private router: Router) {
    router.events.subscribe(() => {
      const url = this.router.url;
      this.hideFooter.set(url.startsWith('/login-required') || url.startsWith('/profile'));
    });
  }
}
