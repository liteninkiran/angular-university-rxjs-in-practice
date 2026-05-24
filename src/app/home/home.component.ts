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

const beginnerCourses = (course: Course) => course.category === 'BEGINNER';
const advancedCourses = (course: Course) => course.category === 'ADVANCED';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[] = [];
  advancedCourses: Course[] = [];

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$ = http$.pipe(map((res) => Object.values(res.payload)));
    courses$.subscribe(
      (courses) => {
        this.beginnerCourses = courses.filter(beginnerCourses);
        this.advancedCourses = courses.filter(advancedCourses);
      },
      noop,
      () => console.log('Completed'),
    );
  }
}
