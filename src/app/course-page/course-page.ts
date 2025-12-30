import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CoursesService } from '../../app/services/courses.service';
import { CourseModule } from '../../app/models/course.models';

@Component({
  standalone: true,
  selector: 'app-course-page',
  imports: [RouterModule],
  templateUrl: './course-page.html',
  styleUrl: './course-page.css',
})
export class CoursePage implements OnInit {
  modules: CourseModule[] = [];

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.modules = this.courseService.getModules();
  }
}