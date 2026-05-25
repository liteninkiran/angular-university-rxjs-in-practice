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

const checkResponse =
  <T>() =>
  (response: Response): Promise<T> => {
    if (!response.ok) {
      throw new Error(`Request failed with status code: ${response.status}`);
    }
    return response.json();
  };

export const createHttpObservable = <T>(url: string) => {
  const observer = (observer: Observer<HttpResponse<T>>) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then(checkResponse<HttpResponse<T>>())
      .then(emitAndComplete(observer))
      .catch((err) => {
        observer.error(err);
      });

    return () => controller.abort();
  };

  return new Observable(observer);
};
