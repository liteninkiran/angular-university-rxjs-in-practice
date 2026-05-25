import { Observable, Observer } from 'rxjs';
import { Course, CourseCategory } from '../model/course';

export type HttpResponse<T> = {
  payload: T;
};

const emitAndComplete =
  <T>(observer: Observer<T>) =>
  (body: T) => {
    observer.next(body);
    observer.complete();
  };

const createHttpObservable = <T>(url: string) => {
  const observer = (observer: Observer<HttpResponse<T>>) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error(`Request failed with status code: ${response.status}`);
          throw new Error('HTTP error');
        }
      })
      .then(emitAndComplete<HttpResponse<T>>(observer))
      .catch((err) => {
        observer.error(err);
      });

    return () => controller.abort();
  };

  return new Observable(observer);
};

const beginner = (courses: Course[]) => courses?.filter(byCategory('BEGINNER'));
const advanced = (courses: Course[]) => courses?.filter(byCategory('ADVANCED'));
const byCategory = (category: CourseCategory) => (course: Course) =>
  course.category === category;

export { beginner, advanced, createHttpObservable };
