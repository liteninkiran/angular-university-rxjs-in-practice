import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

type Setter<T> = (obs$: Observable<T>) => void;

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

  ngAfterViewInit() {
    this.setStream();
  }

  private setCourseObservable() {
    const url = `/api/courses/${this.courseId}`;
    this.setObservable<Course[]>(url, (obs) => {
      this.course$ = obs;
    });
  }

  private setLessonObservable() {
    const url = `/api/lessons?courseId=${this.courseId}&pageSize=100`;
    this.setObservable<Lesson[]>(url, (obs) => {
      this.lessons$ = obs;
    });
  }

  private setObservable<T>(url: string, setter: Setter<T>) {
    const res$ = createHttpObservable<T>(url);
    setter(res$.pipe(map((res) => res.payload)));
  }

  private setStream() {
    const el = this.input.nativeElement;
    const getValue = (event: KeyboardEvent) =>
      (event.target as HTMLInputElement).value;
    const event$ = fromEvent<KeyboardEvent>(el, 'keyup');
    const stream$ = event$.pipe(
      map(getValue),
      debounceTime(400),
      distinctUntilChanged(),
    );
    stream$.subscribe(console.log);
  }
}
