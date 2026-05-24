export type Course = {
  id: number;
  description: string;
  iconUrl: string;
  courseListIcon?: string;
  longDescription: string;
  category: CourseCategory;
  lessonsCount?: number;
};

export type CourseCategory = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type Courses = Course[];
