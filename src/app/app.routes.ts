import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { CoursePage } from './course-page/course-page';
import { AboutPage } from './about-page/about-page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomePage, title: 'AIM ASEAN — Home' },
    { path: 'courses', component: CoursePage, title: 'AIM ASEAN — Courses' },
    { path: 'about', component: AboutPage, title: 'AIM ASEAN — About' },
    { path: '**', redirectTo: '' },
];
