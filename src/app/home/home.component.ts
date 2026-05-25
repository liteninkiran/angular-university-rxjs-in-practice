import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
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
      catchError((err) => {
        console.log('Error:', err);
        return throwError(err);
      }),
      map((res) => res.payload),
      shareReplay(),
      finalize(() => {
        console.log('Finalize');
      }),
    );
  }
}
