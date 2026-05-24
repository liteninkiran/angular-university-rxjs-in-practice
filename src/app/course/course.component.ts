import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, Courses } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false,
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$!: Observable<Course[]>;
  lessons$!: Observable<Lesson[]>;
  courseId!: string;

  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.setCourseObservable();
    this.setLessonObservable();
  }

  ngAfterViewInit() {}

  setCourseObservable() {
    const url = `/api/courses/${this.courseId}`;
    this.setObservable<Course[]>(url, (obs) => (this.course$ = obs));
  }

  setLessonObservable() {
    const url = `/api/lessons?courseId=${this.courseId}&pageSize=100`;
    this.setObservable<Lesson[]>(url, (obs) => (this.lessons$ = obs));
  }

  setObservable<T>(url: string, setter: (obs$: Observable<T>) => void) {
    const res$ = createHttpObservable<T>(url);
    setter(res$.pipe(map((res) => res.payload)));
  }
}
