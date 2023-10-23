import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, interval, noop } from 'rxjs';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

    constructor() {

    }

    public ngOnInit(): void {
        const http$ = Observable.create(observer => {
            fetch('/api/courses')
                .then(response => response.json())
                .then(body => {
                    observer.next(body);
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                })
        });
        http$.subscribe(
            courses => console.log(courses),
            noop,
            () => console.log('Complete'),
        );
    }
}
