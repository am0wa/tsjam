/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RxDisposable } from 'reactive/index.js';
import { type Observable, Subject, type Subscription } from 'rxjs';

import type { DisposableLike } from 'core/disposable.js';

class TestDisposable implements DisposableLike {
  disposed = false;
  dispose() {
    this.disposed = true;
  }
}

describe('RxDisposable', () => {
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
  it('dispose - a throwing teardown does not block unsubscribe nor disposed$', () => {
    const entity = new RxDisposable();
    const boom = new Error('boom');
    const subject$ = new Subject<string>();
    const sub = entity.autoDispose(subject$.subscribe());
    const after = entity.autoDispose(new TestDisposable());
    let disposedEmitted = false;
    entity.disposed$.subscribe(() => (disposedEmitted = true));

    entity.autoDispose(() => {
      throw boom;
    });

    expect(() => entity.dispose()).toThrow(boom);
    expect(sub.closed).toBe(true);
    expect(after.disposed).toBe(true);
    expect(entity.disposed).toBe(true);
    expect(disposedEmitted).toBe(true);
  });
});

describe('RxDisposable - teardown order', () => {
  /** Child that notifies on its own disposal, like a service completing its public streams. */
  class NotifyingChild implements DisposableLike {
    readonly changed$ = new Subject<string>();
    dispose() {
      this.changed$.next('disposing');
      this.changed$.complete();
    }
  }

  it('unsubscribes before disposing children, so no subscription sees a half-disposed child', () => {
    const reactions: string[] = [];

    class Entity extends RxDisposable {
      readonly child = this.autoDispose(new NotifyingChild()); // registered first
      constructor() {
        super();
        this.autoDispose(this.child.changed$.subscribe((v) => reactions.push(v)));
      }
    }

    const entity = new Entity();
    entity.child.changed$.next('alive');
    entity.dispose();

    expect(reactions).toEqual(['alive']);
  });

  it('subscriptions → children & callbacks → disposed$, regardless of registration order', () => {
    const log: string[] = [];
    const entity = new RxDisposable();

    entity.disposed$.subscribe(() => log.push('disposed$'));
    entity.autoDispose(() => log.push('callback'));
    entity.autoDispose({ dispose: () => log.push('child') });
    entity.autoDispose(new Subject<string>().subscribe()).add(() => log.push('subscription'));
    entity.autoDispose({ unsubscribe: () => log.push('unsubscribable') });

    entity.dispose();

    expect(log).toEqual(['subscription', 'unsubscribable', 'callback', 'child', 'disposed$']);
  });
});

describe('RxDisposable - standard ES disposal interop', () => {
  it('autoDispose - accepts SymbolDisposable; using disposes subscriptions and emits disposed$', () => {
    const subject$ = new Subject<string>();
    let symbolDisposed = false;
    let disposedEmitted = false;
    let sub: Subscription | undefined;

    {
      using entity = new RxDisposable();
      entity.disposed$.subscribe(() => (disposedEmitted = true));
      sub = entity.autoDispose(subject$.subscribe());
      entity.autoDispose({ [Symbol.dispose]: () => (symbolDisposed = true) });
    }

    expect(sub.closed).toBe(true);
    expect(symbolDisposed).toBe(true);
    expect(disposedEmitted).toBe(true);
  });
});
