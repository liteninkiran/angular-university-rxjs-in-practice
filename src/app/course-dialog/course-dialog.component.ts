import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
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
import { Store } from '../common/store.service';

export type CourseData = {
  description: string;
  category: CourseCategory;
  releasedAt: moment.Moment;
  longDescription: string;
};

type CourseForm = {
  [K in keyof CourseData]: FormControl<CourseData[K]>;
};

type SaveButton = ElementRef<HTMLButtonElement>;

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false,
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup<CourseForm>;
  course: Course;

  @ViewChild('saveBtn', { read: ElementRef }) saveButton!: SaveButton;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) course: Course,
  ) {
    this.course = course;
    this.form = this.getCourseForm();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.store.saveCourse(this.course.id, this.form.value).subscribe(
      () => this.close(),
      (err: any) => console.log('Error', err),
    );
  }

  getCourseForm() {
    const fb = this.formBuilder.nonNullable;
    const rqd = Validators.required;
    const controls: CourseForm = {
      description: fb.control(this.course.description, rqd),
      category: fb.control(this.course.category, rqd),
      releasedAt: fb.control(moment(), rqd),
      longDescription: fb.control(this.course.longDescription, rqd),
    };
    return fb.group<CourseForm>(controls);
  }
}
