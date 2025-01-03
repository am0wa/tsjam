import { replayLatest } from 'reactive/rx-operators';
import { firstValueFrom, lastValueFrom, of, ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('Rx Operators', () => {
  it('Observable to promise has to emit once', async () => {
    const sample$ = of('A');
    // note: rx7 - to be replaced with lastValueFrom
    const promiseLikeResult = await firstValueFrom(sample$);
    expect(promiseLikeResult).toBe('A');
  });
  it('Subject to promise has to emit once', async () => {
    const sample$$ = new ReplaySubject(1);
    // @see https://github.com/Reactive-Extensions/RxJS/issues/1088
    const samplePromise = firstValueFrom(sample$$);
    sample$$.next('A');
    // note: rx7 - to be replaced with lastValueFrom
    const promiseLikeResult = await samplePromise;
    expect(promiseLikeResult).toBe('A');
  });
  it('firstValueFrom', async () => {
    const sample$$ = new ReplaySubject<string>(1);
    sample$$.next('A');
    const result = await firstValueFrom(sample$$);
    expect(result).toBe('A');
  });
  it('lastValueFrom', async () => {
    const sample$ = of('A', 'B', 'C');
    const result = await lastValueFrom(sample$);
    expect(result).toBe('C');
  });
  it('replayLatest', () => {
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
});
