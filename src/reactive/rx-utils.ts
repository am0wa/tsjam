import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

/**
 * Shared Connectable Observable that Replays the Latest Values from Stream.
 * rx6 example:
 * ```
 *  stream$.pipe(
 *    publishReplay(1),
 *    refCount()
 *  );
 *```
 */
export const replayLatest = <T>(stream$: Observable<T>, bufferSize: number = Number.POSITIVE_INFINITY): Observable<T> => {
  return stream$.pipe(
    share({ connector: () => new ReplaySubject(bufferSize),
    resetOnError: false,
    resetOnComplete: false,
    resetOnRefCountZero: false }
  ))
}