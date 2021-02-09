import { Observable } from 'rxjs';
import { first, last } from 'rxjs/operators';

export const firstValueFrom = <T>(stream: Observable<T>): Promise<T> => {
  return stream.pipe(first()).toPromise();
}

export const lastValueFrom = <T>(stream: Observable<T>): Promise<T> => {
  return stream.pipe(last()).toPromise();
}