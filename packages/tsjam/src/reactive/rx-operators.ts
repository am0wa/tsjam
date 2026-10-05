import { type Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

/**
 * Shares one source subscription and replays the latest `bufferSize` values (1 by default) to every subscriber,
 * late ones included. Stays connected: neither completion, error nor all subscribers leaving resets it –
 * the source keeps running until it ends on its own.
 * For a share that disconnects when subscribers leave use rxjs `shareReplay({ bufferSize, refCount: true })`.
 * Complexity: O(bufferSize) memory; each emission is delivered once per subscriber.
 */
export const replayLatest = (bufferSize = 1) => {
  return <T>(stream$: Observable<T>): Observable<T> => {
    return stream$.pipe(
      share({
        connector: () => new ReplaySubject<T>(bufferSize),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false,
      }),
    );
  };
};
