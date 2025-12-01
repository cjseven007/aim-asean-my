export interface CourseVideo {
  id: string;
  title: string;
  duration: string;       // e.g. "12:34"
  youtubeId: string;      // e.g. "dQw4w9WgXcQ"
  isPreview?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;       // e.g. "4h 30m"
  thumbnailUrl?: string;
  videos: CourseVideo[];
  isCompulsory:boolean
}