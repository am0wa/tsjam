import { from, interval, Observable, timer, zip } from 'rxjs';
import { concatMap, delayWhen, distinctUntilChanged, ignoreElements, map, startWith } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

/**
 * @see https://rxjs.dev/guide/testing/marble-testing
 */
describe('Rx-Marbles', () => {
  // creating rx test scheduler with virtual time
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  // note: this test runs synchronously.
  it('basic rx-marble map operator test', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const values = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
      const source$ = cold(' -a-b-c-d-e|', values);
      const expectedMarble = '-a-b-c-d-e|';
      const expectedValues = { a: 10, b: 20, c: 30, d: 40, e: 50 };

      expectObservable(source$.pipe(map((one) => one * 10))).toBe(expectedMarble, expectedValues);
    });
  });
  it('basic hot subscribe/unsubscribe test', () => {
    testScheduler.run((helpers) => {
      const { hot, expectObservable } = helpers;
      const source$ = hot(' -a-b-c-d-e-f-g-h|');
      const subscription1 = '       -----^-----!';
      const expectedMarble = '      -----c-d-e-';
      const subscription2 = '       ---------^-!';
      const expectedMarble2 = '     ---------e-';

      expectObservable(source$, subscription1).toBe(expectedMarble);
      expectObservable(source$, subscription2).toBe(expectedMarble2);
    });
  });
  it('test real source', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const source$: Observable<string> = zip(from(['a', 'b', 'c', 'd', 'e']), interval(2)).pipe(
        map(([value]) => value),
      );
      const expectedMarble = '--a-b-c-d-(e|)';

      expectObservable(source$).toBe(expectedMarble);
    });
  });
  it('simple delayWhen marble', () => {
    testScheduler.run((helpers) => {
      const { hot, expectObservable } = helpers;
      const source$ = hot(' -a-b-c-d-e-f-g-h|');
      const subscription1 = '       -----^-------!';
      const pureMarble = '          -----c-d-e-f-';
      const result$ = source$.pipe(delayWhen(() => timer(2)));
      const delayedMarble = '       -------c-d-e';

      expectObservable(source$, subscription1).toBe(pureMarble);
      expectObservable(result$, subscription1).toBe(delayedMarble);
    });
  });
  it('advanced delayWhen marble', () => {
    testScheduler.run((helpers) => {
      const { hot, expectObservable } = helpers;
      const delayValues = {
        a: { v: 'a', d: 2 },
        b: { v: 'b', d: 2 },
        c: { v: 'c', d: 5 },
        d: { v: 'd', d: 2 },
        e: { v: 'e', d: 2 },
        f: { v: 'f', d: 2 },
      };
      const source$ = hot(' -a-b-c-d-e-f-g-h|', delayValues);
      const subscription1 = '       -----^-------!';
      const pureMarble = '          -----c-d-e-f-';
      const result$ = source$.pipe(
        delayWhen(({ d }) => timer(d)),
        map(({ v }) => v),
      );
      const delayedMarble = '       ---------dce'; // note 'c' changed the order!

      expectObservable(source$.pipe(map(({ v }) => v)), subscription1).toBe(pureMarble);
      expectObservable(result$, subscription1).toBe(delayedMarble);
    });
  });
  it('2 sources time-sync test', () => {
    testScheduler.run((helpers) => {
      const { hot, expectObservable } = helpers;
      const source$ = hot(' -a-b-c-d-e-f-g-h|'); // e.g. server
      const subscription1 = '       -----^-------!';
      const pureMarble = '          -----c-d-e-f-';

      const delayValues = {
        a: { v: 'a', d: 2 },
        b: { v: 'b', d: 2 },
        c: { v: 'c', d: 4 },
        d: { v: 'd', d: 2 },
        e: { v: 'e', d: 2 },
        f: { v: 'f', d: 2 },
      };
      const delay$ = hot('  -a-b-c-d-e-f-g-h|', delayValues);
      const syncedMarble = '        -----c---d-e-';
      const delayedServer$ = delay$.pipe(
        concatMap(
          (
            { v, d }, // map to inner observable jump to next when it completes
          ) =>
            timer(d).pipe(
              ignoreElements(), // ignore until complete
              startWith(v), // no delay for first element
            ),
        ),
      );

      expectObservable(source$, subscription1).toBe(pureMarble);
      expectObservable(delayedServer$, subscription1).toBe(syncedMarble);
    });
  });
  it('sequential state version', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const values = { a: 1, b: 3, c: 2, d: 4, e: 6, f: 6 };
      const source$ = cold(' -a-b-c-d-e-f|', values);
      const expectedMarble = '-a-b---d-e-f|';
      const expectedValues = { a: 1, b: 3, d: 4, e: 6, f: 6 };

      expectObservable(source$.pipe(distinctUntilChanged((prev, curr) => prev > curr))).toBe(
        expectedMarble,
        expectedValues,
      );
    });
  });
});
