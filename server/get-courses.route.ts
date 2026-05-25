import { Request, Response } from 'express';
import { COURSES } from './db-data';
import { Course } from '../src/app/model/course';

export function getAllCourses(req: Request, res: Response) {
  if (getError()) {
    res.status(500).json({ message: 'An error occurred.' });
  } else {
    setTimeout(() => {
      res.status(200).json({ payload: Object.values(COURSES) });
    }, 200);
  }
}

export function getCourseById(req: Request, res: Response) {
  const courseId = req.params['id'];
  const courses: any = Object.values(COURSES);
  const course = courses.find((course: Course) => course.id === +courseId);
  res.status(200).json({ payload: course });
}

function getError() {
  const rnd = Math.random();
  const dec = getDecimals(rnd);
  const pct = `${(rnd * 100).toFixed(dec)}%`;

  const errRate = 0;
  // const errRate = 1;
  // const errRate = 0.7;

  return rnd <= errRate;
}

function getDecimals(x: number) {
  if (x <= 0.01) return 2;
  if (x <= 0.1) return 1;
  return 0;
}
