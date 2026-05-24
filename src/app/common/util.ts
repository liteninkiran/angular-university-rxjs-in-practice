import { Observable, Observer } from 'rxjs';

export type HttpResponse<T> = {
  payload: T;
};

const emitAndComplete =
  <T>(observer: Observer<T>) =>
  (body: T) => {
    observer.next(body);
    observer.complete();
  };

export const createHttpObservable = <T>(url: string) => {
  const observer = (observer: Observer<HttpResponse<T>>) => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(emitAndComplete<HttpResponse<T>>(observer))
      .catch((err) => observer.error(err));

    return () => controller.abort();
  };

  return new Observable(observer);
};
