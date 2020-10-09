import { Disposable } from 'core';
import { RxBag } from 'reactive';
import { Subject } from 'rxjs';

describe('RxBag',() => {

  it('dispose - has to unsubscribe from all - dispose added afterwards', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rxBag = RxBag.create();
    const subjA$ = new Subject<string>();
    const subjB$ = new Subject<string>();
    const subjC$ = new Subject<string>();

    let a: string | undefined;
    let b: string | undefined;
    let c: string | undefined;
    const subA = subjA$.asObservable().subscribe(v => a = v);
    const subB = subjB$.asObservable().subscribe(v => b = v);
    const subC = subjC$.asObservable().subscribe(v => c = v);

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
})

class TestDisposable extends Disposable {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  constructor(readonly $s = RxBag.create()) {
    super();
    const subjA$ = new Subject<string>();
    const stream$ = subjA$.asObservable();
    const subA = stream$.subscribe(() => { console.log('emitted') });
    $s.add(
      stream$.subscribe(() => { console.log('emitted') })
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this._ripBag.add(() => $s.dispose());
  }
}
