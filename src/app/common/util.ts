import { Observable, Observer } from 'rxjs';
import { Course, CourseCategory } from '../model/course';

type HttpResponse<T> = {
  payload: T;
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
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
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

export {
  beginner as beginnerFilter,
  advanced as advancedFilter,
  createHttpObservable,
};
