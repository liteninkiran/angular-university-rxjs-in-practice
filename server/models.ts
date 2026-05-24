export type Course = {
  id: number;
  description: string;
  iconUrl: string;
  longDescription: string;
  category: string;
  courseListIcon?: string;
  lessonsCount?: number;
};

export type Lesson = {
  id: number;
  description: string;
  duration: string;
  seqNo: number;
  courseId: number;
};

export type Courses = Record<string, Course>;
export type Lessons = Record<string, Lesson>;
