import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable, timer } from 'rxjs';
import { delayWhen, map, retryWhen, shareReplay } from 'rxjs/operators';
import { advanced, beginner, createHttpObservable } from '../common/util';

type CoursesObservable = Observable<Course[]>;

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
    this.setCoursesObservables();
  }

  private setCoursesObservables() {
    const courses$ = this.getCoursesObservables();
    this.beginnerCourses$ = courses$.pipe(map(beginner));
    this.advancedCourses$ = courses$.pipe(map(advanced));
  }

  private getCoursesObservables() {
    const http$ = createHttpObservable<Course[]>('/api/courses');
    return http$.pipe(
      map((res) => res.payload),
      shareReplay(),
      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000)))),
    );
  }
}
