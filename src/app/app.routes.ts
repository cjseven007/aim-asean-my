import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CoursePage } from './pages/course-page/course-page';
import { CourseDetailPage } from './pages/course-detail-page/course-detail-page';
import { AboutPage } from './pages/about-page/about-page';
import { ToolsPage } from './pages/tools-page/tools-page';

import { AuthGuard } from './guards/auth.guard';
import { ProfileCompletedGuard } from './guards/profile-completed.guard';
import { LoginRequiredPage } from './pages/login-required-page/login-required-page';
import { ProfilePage } from './pages/profile-page/profile-page';

export const routes: Routes = [
{ path: '', pathMatch: 'full', component: HomePage, title: 'AIM ASEAN — Home' },

  {
    path: 'courses',
    component: CoursePage,
    canActivate: [AuthGuard, ProfileCompletedGuard],
    title: 'AIM ASEAN — Courses',
  },
  {
    path: 'courses/:id',
    component: CourseDetailPage,
    canActivate: [AuthGuard, ProfileCompletedGuard],
    title: 'AIM ASEAN — Course Detail',
  },

  { path: 'tools', component: ToolsPage, title: 'AIM ASEAN — AI Tools' },
  { path: 'about', component: AboutPage, title: 'AIM ASEAN — About' },

  {
    path: 'login-required',
    component: LoginRequiredPage,
    title: 'AIM ASEAN — Sign in required',
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard],
    title: 'AIM ASEAN — Profile',
  },

  { path: '**', redirectTo: '' },
];
