import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { noop, Observable, Observer } from 'rxjs';
import { Course } from '../model/course';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const observer = (observer: Observer<Course[]>) => {
      fetch('/api/courses')
        .then((res) => res.json())
        .then((body) => {
          observer.next(body);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    };
    const http$: Observable<Course[]> = new Observable(observer);
    http$.subscribe(
      (courses) => console.log(courses),
      noop,
      () => console.log('Completed'),
    );
  }
}
