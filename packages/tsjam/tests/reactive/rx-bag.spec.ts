import { RxBag } from 'reactive/index.js';
import { of, Subject, type Subscription } from 'rxjs';

import { Disposable } from 'core/disposable.js';

describe('RxBag', () => {
  it('dispose - has to unsubscribe from all - dispose added afterwards', () => {
    const rxBag = RxBag.create();
    const subjA$ = new Subject<string>();
    const subjB$ = new Subject<string>();
    const subjC$ = new Subject<string>();

    let a: string | undefined;
    let b: string | undefined;
    let c: string | undefined;
    const subA = subjA$.asObservable().subscribe((v) => (a = v));
    const subB = subjB$.asObservable().subscribe((v) => (b = v));
    const subC = subjC$.asObservable().subscribe((v) => (c = v));

    rxBag.add(subA);
    rxBag.add(subB);
    expect(rxBag.size).toBe(2);

    subjA$.next('A1');
    expect(a).toBe('A1');

    subjB$.next('B1');
    expect(b).toBe('B1');

    rxBag.dispose();
    expect(rxBag.size).toBe(0);
    expect(subA.closed).toBe(true);
    expect(subB.closed).toBe(true);

    expect(rxBag.disposed).toBe(true);
    rxBag.add(subC);
    expect(rxBag.size).toBe(0);

    subjA$.next('A2');
    expect(a).toBe('A1');

    subjB$.next('B2');
    expect(b).toBe('B1');

    subjC$.next('C1');
    expect(c).toBeUndefined();
  });

  it('size - shrinks when a subscription ends early', () => {
    const rxBag = RxBag.create();
    const subjA$ = new Subject<string>();
    const subA = rxBag.add(subjA$.subscribe());
    const subB = new Subject<string>().subscribe();
    rxBag.add(subB);
    rxBag.add(() => undefined);
    expect(rxBag.size).toBe(3);

    subjA$.complete();
    subB.unsubscribe();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect((subA as Subscription).closed).toBe(true);
    expect(rxBag.size).toBe(1);
  });

  it('size - ignores closed subscriptions', () => {
    const rxBag = RxBag.create();
    const sub = rxBag.add(of(1).subscribe());

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect((sub as Subscription).closed).toBe(true);
    expect(rxBag.size).toBe(0);
  });

  it('size - counts a duplicate callback twice, as rxjs invokes it twice', () => {
    const rxBag = RxBag.create();
    let calls = 0;
    const cb = (): void => {
      calls++;
    };

    rxBag.add(cb);
    rxBag.add(cb);
    expect(rxBag.size).toBe(2);

    rxBag.dispose();
    expect(calls).toBe(2);
    expect(rxBag.size).toBe(0);
  });

  it('size - stays 0 when adding any teardown after dispose', () => {
    const rxBag = RxBag.create();
    rxBag.dispose();
    let flushed = 0;

    rxBag.add(() => flushed++);
    rxBag.add({ unsubscribe: () => flushed++ });
    expect(flushed).toBe(2);
    expect(rxBag.size).toBe(0);
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestDisposable extends Disposable {
  constructor(readonly $s = RxBag.create()) {
    super();
    const subjA$ = new Subject<string>();
    const stream$ = subjA$.asObservable();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subA = stream$.subscribe(() => {
      console.log('emitted');
    });
    $s.add(
      stream$.subscribe(() => {
        console.log('emitted');
      }),
    );

    this._ripBag.add(() => $s.dispose());
  }
}
