import { ALPHABET, isSomething, type Milliseconds } from 'core';
import { from, noop, Observable, Subscription, timer, zip } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

export namespace RxTestUtils {
  // like .from, but items are delayed by their value
  type DelayedData<T> = { readonly data: T; readonly delay: Milliseconds };
  export const fromDelayed$ = <T>(arr: readonly DelayedData<T>[]): Observable<DelayedData<T>> => {
    return from(arr).pipe(delayWhen((x) => timer(x.delay)));
  };

  export const alphabetInterval$ = (period: number): Observable<{ readonly tick: number; readonly value: string }> => {
    const alphabet$ = from(ALPHABET);
    return zip(timer(0, period), alphabet$, (tick, letter) => ({ tick, value: letter }));
  };

  type TestSub<T> = { fireCount: number; received: T[]; sub?: Subscription };
  export const testSubscribe = <T>(source$: Observable<T>, complete?: () => void): TestSub<T> => {
    const result: TestSub<T> = { fireCount: 0, received: [] };
    result.sub = source$.subscribe(
      (x) => {
        result.received.push(x);
        result.fireCount++;
      },
      noop,
      () => {
        if (isSomething(complete)) {
          complete();
        }
      },
    );
    return result;
  };
}
