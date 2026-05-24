import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, interval, timer } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const interval$ = interval(1000);
    const interval$ = timer(3000, 1000);
    const sub = interval$.subscribe((val) => console.log(`Stream 1: ${val}`));
    // interval$.subscribe((val) => console.log(`Stream 2: ${val}`));
    setTimeout(() => sub.unsubscribe(), 6000);

    const click$ = fromEvent(document, 'click');
    click$.subscribe(
      (event) => console.log(event),
      (error) => console.log(error),
      () => console.log('Completed'),
    );
  }
}
