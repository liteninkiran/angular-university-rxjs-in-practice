import { Request, Response } from 'express';
import { COURSES } from './db-data';

export function getAllCourses(req: Request, res: Response) {
    const error = false;
    const errorNum = (Math.random() >= 0.5);
    const delay = Math.random() * 1000 + 500;

    if (error && errorNum) {
        console.log('ERROR loading courses!');
        const response = { message: 'A random error occurred.' }
        res.status(500).json(response);
    } else {
        const response = { payload: Object.values(COURSES) }
        setTimeout(() => res.status(200).json(response), delay);
    }
}

export function getCourseById(req: Request, res: Response) {
    const courseId = req.params['id'];
    const courses: any = Object.values(COURSES);
    const course = courses.find(course => course.id == courseId);
    res.status(200).json(course);
}
