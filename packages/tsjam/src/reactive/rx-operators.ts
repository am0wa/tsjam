import { Observable, ReplaySubject } from 'rxjs';
import { share, shareReplay } from 'rxjs/operators';

/**
 * shareReplay operator with internal refCount.
 * When the reference count drops to zero,
 * the replay-able notifications are flushed if the subject has not completed.
 * @example Useful to replay last message to subscriber e.g. `refCountShareReplay(1)`.
 *        For example in the stream of some setting values you're interested only in the latest one.
 * @see https://github.com/ReactiveX/rxjs/pull/4059#issuecomment-416783538
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const shareReplayRefCount = <T>(bufferSize: number) => shareReplay<T>({ refCount: true, bufferSize });

/**
 * Shared Connectable Observable that Replays the Latest Values from Stream.
 * @see https://rxjs.dev/deprecations/multicasting
 *
 * rx6 example:
 * ```
 *  stream$.pipe(
 *    publishReplay(1),
 *    refCount()
 *  );
 * ```
 */
export const replayLatest = (bufferSize: number = Number.POSITIVE_INFINITY) => {
  return <T>(stream$: Observable<T>): Observable<T> => {
    return stream$.pipe(
      share({
        connector: () => new ReplaySubject(bufferSize),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false,
      }),
    );
  };
};
