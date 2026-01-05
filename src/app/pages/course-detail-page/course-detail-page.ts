import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CoursesService } from '../../services/courses.service';
import { CourseModule, CourseVideo } from '../../models/course.models';


@Component({
  standalone: true,
  selector: 'app-course-detail-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.css',
})
export class CourseDetailPage {
module?: CourseModule;
  selectedVideo?: CourseVideo;
  safeVideoUrl?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private courseService: CoursesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/courses']);
      return;
    }

    const mod = this.courseService.getModuleById(id);
    if (!mod) {
      this.router.navigate(['/courses']);
      return;
    }

    this.module = mod;
    if (this.module.videos.length > 0) {
      this.selectVideo(this.module.videos[0]);
    }
  }

  selectVideo(video: CourseVideo): void {
    this.selectedVideo = video;
    const url = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isActive(video: CourseVideo): boolean {
    return this.selectedVideo?.id === video.id;
  }
}
