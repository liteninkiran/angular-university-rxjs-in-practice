import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course, CourseCategory } from '../model/course';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

type CourseData = {
  description: string;
  category: CourseCategory;
  releasedAt: moment.Moment;
  longDescription: string;
};

type CourseForm = {
  [K in keyof CourseData]: FormControl<CourseData[K]>;
};

const getInit = (changes: Partial<CourseData>): RequestInit => ({
  method: 'PUT',
  body: JSON.stringify(changes),
  headers: { 'content-type': 'application/json' },
});

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup<CourseForm>;
  course: Course;

  @ViewChild('saveButton', { static: true }) saveButton!: ElementRef;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
  ) {
    this.course = course;
    this.form = this.formBuilder.nonNullable.group<CourseForm>(
      this.getCourseForm(),
    );
  }

  ngOnInit() {
    this.subscribeToFormChanges();
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {}

  saveCourse(changes: Partial<CourseData>) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, getInit(changes)),
    );
  }

  subscribeToFormChanges() {
    const callback = (changes: Partial<CourseData>) => this.saveCourse(changes);
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap(callback),
      )
      .subscribe();
  }

  getCourseForm(): CourseForm {
    const fb = this.formBuilder.nonNullable;
    const rqd = Validators.required;
    return {
      description: fb.control(this.course.description, rqd),
      category: fb.control(this.course.category, rqd),
      releasedAt: fb.control(moment(), rqd),
      longDescription: fb.control(this.course.longDescription, rqd),
    };
  }
}
