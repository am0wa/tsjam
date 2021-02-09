import { ConnectableObservable, Observable, UnaryFunction } from 'rxjs';
import { filter, map, publishReplay, shareReplay } from 'rxjs/operators';

/**
 * shareReplay operator with internal refCount.
 * When the reference count drops to zero,
 * the replay-able notifications are flushed if the subject has not completed.
 * @usage Useful to replay last message to subscriber e.g. `refCountShareReplay(1)`.
 *        For example in the stream of some setting values you're interested only in the latest one.
 * @see https://github.com/ReactiveX/rxjs/pull/4059#issuecomment-416783538
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const shareReplayRefCount = <T>(bufferSize: number) =>
  shareReplay<T>({ refCount: true, bufferSize });

/**
 * publishReplay operator that correctly returns ConnectableObservable<T>
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const connectablePublishReplay = <T>(bufferSize: number) =>
  publishReplay(bufferSize) as UnaryFunction<Observable<T>, ConnectableObservable<T>>;

/**
 * map + filter operator - maps then filters out `undefined` values.
 */
export const mapFilterNotUndefined = <T, R>(mapFn: (value: T) => R | undefined) => {
  return (source: Observable<T>): Observable<R> => source.pipe(
    map(mapFn),
    filter((m): m is R => m !== undefined)
  );
}
