import { firstValueFrom, lastValueFrom } from 'reactive/rx-utils';
import { of, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('Rx Utils', () => {
  it('Observable to promise has to emit once', async () => {
    const sample$ = of('A');
    // note: rx7 - to be replaced with lastValueFrom
    const promiseLikeResult = await sample$.toPromise();
    expect(promiseLikeResult).toBe('A');
  });
  it('Subject to promise has to emit once', async () => {
    const sample$$ = new ReplaySubject(1);
    // @see https://github.com/Reactive-Extensions/RxJS/issues/1088
    const samplePromise = sample$$.pipe(take(1)).toPromise();
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
});