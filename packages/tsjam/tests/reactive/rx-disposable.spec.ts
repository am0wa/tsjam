import { type Observable, Subject, type Subscription } from 'rxjs';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RxBag, RxDisposable } from 'reactive/index.js';

import type { DisposableLike } from 'core/disposable.js';

class TestDisposable implements DisposableLike {
  disposed = false;
  dispose() {
    this.disposed = true;
  }
}

describe('RxDisposable', () => {
  it('dispose - has to unsubscribe all immediately after dispose invocation', () => {
    const bag = RxBag.create();

    let a: string | undefined;
    let b: string | undefined;
    let c: string | undefined;
    const cbA = {
      unsubscribe: () => {
        a = 'A';
      },
    };
    const cbB = () => (b = 'B');
    const cbC = () => (c = 'C');

    bag.add(cbA);
    bag.add(cbB);
    expect(bag.size).toBe(2);

    expect(a).toBeUndefined();
    expect(b).toBeUndefined();

    bag.dispose();
    expect(bag.disposed).toBe(true);

    expect(a).toBe('A');
    expect(b).toBe('B');

    expect(c).toBeUndefined();
    bag.add(cbC);
    expect(c).toBe('C');
  });
  it('dispose - to avoid extra invocations when disposed', () => {
    const bag = RxBag.create();

    let invocations = 0;
    const cbD = {
      unsubscribe: () => {
        invocations++;
      },
    };

    bag.add(cbD);
    bag.dispose();
    bag.dispose();
    expect(bag.size).toBe(0);
    expect(invocations).toBe(1);
  });

  it('autoDispose to support rx and functional teardown', () => {
    const subjA$ = new Subject<string>();
    const streamA$ = subjA$.asObservable();
    const subjH$ = new Subject<string>();

    let valueA: string | undefined;
    let valueB: string | undefined;
    let valueC: string | undefined;
    let valueD: string | undefined;
    let valueE: string | undefined;
    let valueH: string | undefined;

    class RxDisposableTest extends RxDisposable {
      readonly update$: Observable<string>;
      readonly child: TestDisposable;
      readonly subA: Subscription;
      constructor() {
        super();

        // add streams
        this.subA = this.autoDispose(streamA$.subscribe((v) => (valueA = v)));
        // add disposables - and assign instance in one line
        this.child = this.autoDispose(new TestDisposable());
        // add dispose callbacks
        this.autoDispose(() => (valueB = 'B'));
        // add unsubscribable objects
        this.autoDispose({ unsubscribe: () => (valueC = 'C') });
        // add disposable objects
        this.autoDispose({ dispose: () => (valueD = 'D') });
        // external entities might could receive update after dispose of the object
        this.disposed$.subscribe(() => (valueE = 'E'));
        // external steams will be autoCompleted after the dispose of the object
        this.update$ = this.autoComplete$(subjH$);
      }
    }

    const obj = new RxDisposableTest();
    const externalSub = obj.update$.subscribe((v) => (valueH = v));

    subjA$.next('A');
    subjH$.next('H');
    expect(valueA).toBe('A');
    expect(valueB).toBeUndefined();
    expect(valueC).toBeUndefined();
    expect(valueD).toBeUndefined();

    obj.dispose();

    subjA$.next('A2');
    subjH$.next('H2');
    expect(obj.subA.closed).toBe(true);
    expect(externalSub.closed).toBe(true);
    expect(obj.child.disposed).toBe(true);
    expect(valueA).toBe('A');
    // expect(valueB).toBe('B');
    expect(valueC).toBe('C');
    expect(valueD).toBe('D');
    expect(valueE).toBe('E');
    expect(valueH).toBe('H');
    expect(obj.disposed).toBe(true);
  });
});
