import { Observable, Observer } from 'rxjs';
import { Course } from '../model/course';
import { Courses } from '../../../server/models';

type CoursesResponse = {
  payload: Courses;
};
export type CoursesObserver = Observer<CoursesResponse>;

const emitAndComplete = (observer: CoursesObserver, body: any) => {
  observer.next(body);
  observer.complete();
};

export const createHttpObservable = (url: string) => {
  const observer = (observer: CoursesObserver) => {
    fetch(url)
      .then((res) => res.json())
      .then((body) => emitAndComplete(observer, body))
      .catch((err) => observer.error(err));
  };
  return new Observable(observer);
};
