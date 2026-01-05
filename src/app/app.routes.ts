import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CoursePage } from './pages/course-page/course-page';
import { CourseDetailPage } from './pages/course-detail-page/course-detail-page';
import { AboutPage } from './pages/about-page/about-page';
import { ToolsPage } from './pages/tools-page/tools-page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomePage, title: 'AIM ASEAN — Home' },
    { path: 'courses', component: CoursePage, title: 'AIM ASEAN — Courses' },
    { path: 'tools', component: ToolsPage, title: 'AIM ASEAN — AI Tools' },
    {path: 'courses/:id',component: CourseDetailPage,title: 'AIM ASEAN — Course Detail',},
    { path: 'about', component: AboutPage, title: 'AIM ASEAN — About' },
    { path: '**', redirectTo: '' },
];
