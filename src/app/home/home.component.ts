import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, noop, Observable, of, timer } from 'rxjs';
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

type CoursesObservable = Observable<Course[]>;

const beginnerCourse = (course: Course) => course.category === 'BEGINNER';
const advancedCourse = (course: Course) => course.category === 'ADVANCED';

const beginnerCourses = (courses: Course[]) => courses.filter(beginnerCourse);
const advancedCourses = (courses: Course[]) => courses.filter(advancedCourse);

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses$!: CoursesObservable;
  advancedCourses$!: CoursesObservable;

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$ = http$.pipe(map((res) => Object.values(res.payload)));
    this.beginnerCourses$ = courses$.pipe(map(beginnerCourses));
    this.advancedCourses$ = courses$.pipe(map(advancedCourses));
  }
}
