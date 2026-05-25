import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../model/course';
import { map } from 'rxjs/operators';
import { advancedFilter, beginnerFilter, createHttpObservable } from './util';

@Injectable({
  providedIn: 'root',
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  public courses$: Observable<Course[]> = this.subject.asObservable();

  public init() {
    this.getCoursesObservables();
  }

  public selectBeginnerCourses() {
    return this.courses$.pipe(map(beginnerFilter));
  }

  public selectAdvancedCourses() {
    return this.courses$.pipe(map(advancedFilter));
  }

  private getCoursesObservables() {
    const http$ = createHttpObservable<Course[]>('/api/courses');
    const courses$ = http$.pipe(map((res) => res.payload));
    courses$.subscribe((courses) => this.subject.next(courses));
  }
}
