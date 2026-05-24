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

/*
type CourseForm = {
  description: FormControl<string>;
  category: FormControl<CourseCategory>;
  releasedAt: FormControl<moment.Moment>;
  longDescription: FormControl<string>;
}
*/

type Changes = Partial<CourseData>;

const getInit = (changes: Changes): RequestInit => ({
  method: 'PUT',
  body: JSON.stringify(changes),
  headers: { 'content-type': 'application/json' },
});

const saveCourse = (id: number, changes: Changes) =>
  fromPromise(fetch(`/api/courses/${id}`, getInit(changes)));

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup<CourseForm>;
  course: Course;

  @ViewChild('saveButton', { read: ElementRef })
  saveButton!: ElementRef<HTMLButtonElement>;
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

  ngAfterViewInit() {
    this.subscribeToSaveClick();
  }

  close() {
    this.dialogRef.close();
  }

  save() {}

  subscribeToSaveClick() {
    const save = () => saveCourse(this.course.id, this.form.value);
    const el = this.saveButton.nativeElement;
    const click$ = fromEvent(el, 'click').pipe(exhaustMap(save));
    click$.subscribe();
  }

  subscribeToFormChanges() {
    const validOnly = () => this.form.valid;
    const save = (changes: Changes) => saveCourse(this.course.id, changes);
    const changes$ = this.form.valueChanges;
    const saveStream$ = changes$.pipe(filter(validOnly), exhaustMap(save));
    saveStream$.subscribe();
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
