import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Course } from '../model/course';
import { map } from 'rxjs/operators';
import { advancedFilter, beginnerFilter, createHttpObservable } from './util';
import { CourseData } from '../course-dialog/course-dialog.component';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';

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

  public saveCourse(courseId: number, changes: Partial<CourseData>) {
    const mappedChanges: Partial<Course> = {
      category: changes.category,
      longDescription: changes.longDescription,
      description: changes.description,
    };
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex((course) => course.id == courseId);
    const newCourses = courses.slice(0);
    const updatedCourse: Course = {
      ...courses[courseIndex],
      ...mappedChanges,
    };
    newCourses[courseIndex] = updatedCourse;
    this.subject.next(newCourses);
    const options = {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json',
      },
    };
    const url = `/api/courses/${courseId}`;
    return fromPromise(fetch(url, options));
  }

  private getCoursesObservables() {
    const http$ = createHttpObservable<Course[]>('/api/courses');
    const courses$ = http$.pipe(map((res) => res.payload));
    courses$.subscribe((courses) => this.subject.next(courses));
  }
}
