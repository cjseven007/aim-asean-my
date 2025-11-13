import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  open = signal(false);
    navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Courses', path: '/courses' },
    { label: 'About', path: '/about' },
  ];
}
