import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { Store } from '../common/store.service';

type CoursesObservable = Observable<Course[]>;

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: CoursesObservable;
  advancedCourses$: CoursesObservable;

  constructor(private store: Store) {
    this.beginnerCourses$ = this.store.selectBeginnerCourses();
    this.advancedCourses$ = this.store.selectAdvancedCourses();
  }

  ngOnInit() {}
}
