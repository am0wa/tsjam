import { replayLatest } from 'reactive/rx-operators.js';
import { defer, type Observable, of, Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('Rx Operators', () => {
  describe('replayLatest', () => {
    it('replays the latest bufferSize values to late subscribers (marbles)', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const source$ = hot(' -a-b-c-d-e-f-g-h|').pipe(replayLatest(1));
        const subscription1 = '       -----^-----!';
        const expectedMarble = '      -----c-d-e-';
        const subscription2 = '       --------^--!';
        const expectedMarble2 = '     --------de-';

        expectObservable(source$, subscription1).toBe(expectedMarble);
        expectObservable(source$, subscription2).toBe(expectedMarble2);
      });
    });

    it('replays only the latest value by default', () => {
      const source$ = new Subject<number>();
      const shared$ = source$.pipe(replayLatest());
      const connection = shared$.subscribe();
      [1, 2, 3].forEach((v) => source$.next(v));

      const late: number[] = [];
      shared$.subscribe((v) => late.push(v)).unsubscribe();
      expect(late).toEqual([3]);
      connection.unsubscribe();
    });

    it('stays connected when all subscribers leave', () => {
      let sourceSubscriptions = 0;
      const source$ = new Subject<number>();
      const shared$ = defer(() => {
        sourceSubscriptions++;
        return source$;
      }).pipe(replayLatest());

      shared$.subscribe().unsubscribe();
      source$.next(7);
      const late: number[] = [];
      shared$.subscribe((v) => late.push(v));

      expect(sourceSubscriptions).toBe(1);
      expect(late).toEqual([7]);
    });

    it('keeps the stream type', () => {
      const n$: Observable<number> = of(1).pipe(replayLatest());
      const values: number[] = [];
      n$.subscribe((v) => values.push(v));
      expect(values).toEqual([1]);
    });
  });
});
