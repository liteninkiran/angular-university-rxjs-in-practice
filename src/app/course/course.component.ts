import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { concat, fromEvent, Observable } from 'rxjs';
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
  courseId: string;

  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  constructor(private route: ActivatedRoute) {
    this.courseId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.setCourseObservable();
  }

  ngAfterViewInit() {
    this.setLessonObservable();
  }

  private setCourseObservable() {
    const url = `/api/courses/${this.courseId}`;
    this.course$ = this.getObservable<Course[]>(url);
  }

  private setLessonObservable() {
    this.lessons$ = this.getSearchStream();
  }

  private getObservable<T>(url: string) {
    const res$ = createHttpObservable<T>(url);
    return res$.pipe(map((res) => res.payload));
  }

  private getLessonsUrl(search = '') {
    let url = `/api/lessons?courseId=${this.courseId}&pageSize=100`;
    if (search) {
      url += `&filter=${search}`;
    }
    return url;
  }

  private getSearchStream() {
    const el = this.input.nativeElement;
    const getValue = (event: KeyboardEvent) =>
      (event.target as HTMLInputElement).value;
    const filterLessons = (search: string) =>
      this.getObservable<Lesson[]>(this.getLessonsUrl(search));
    return fromEvent<KeyboardEvent>(el, 'keyup').pipe(
      map<KeyboardEvent, string>(getValue),
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(filterLessons),
    );
  }
}
