import { Component, OnInit } from '@angular/core';
import { Course, CourseCategory } from '../model/course';
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

const beginner = (courses: Course[]) => courses.filter(byCategory('BEGINNER'));
const advanced = (courses: Course[]) => courses.filter(byCategory('ADVANCED'));

const byCategory = (category: CourseCategory) => (course: Course) =>
  course.category === category;

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
    const http$ = createHttpObservable<Course[]>('/api/courses');
    const courses$ = http$.pipe(
      map((res) => res.payload),
      shareReplay(),
    );
    this.beginnerCourses$ = courses$.pipe(map(beginner));
    this.advancedCourses$ = courses$.pipe(map(advanced));
  }
}
