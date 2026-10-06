import { Subject } from 'rxjs';

import { Disposable, isDisposable, isSymbolDisposable, isUnsubscribable } from 'core/disposable.js';
import { DisposeBag } from 'core/dispose-bag.js';

describe('Standard ES disposal interop', () => {
  it('isSymbolDisposable - detects [Symbol.dispose] only', () => {
    expect(isSymbolDisposable({ [Symbol.dispose]: () => undefined })).toBe(true);
    expect(isSymbolDisposable({ dispose: () => undefined })).toBe(false);
    expect(isSymbolDisposable(() => undefined)).toBe(false);
    expect(isSymbolDisposable(null)).toBe(false);
  });

  it('isDisposable - keeps its own dispose() contract', () => {
    expect(isDisposable({ dispose: () => undefined })).toBe(true);
    expect(isDisposable({ [Symbol.dispose]: () => undefined })).toBe(false);
  });

  it('DisposeBag - tears down dispose(), [Symbol.dispose]() and callbacks', () => {
    const bag = DisposeBag.create();
    const calls: string[] = [];

    bag.add({ dispose: () => calls.push('dispose') });
    bag.add({ [Symbol.dispose]: () => calls.push('symbol') });
    bag.add(() => calls.push('callback'));
    bag.dispose();

    expect(calls).toEqual(['callback', 'symbol', 'dispose']); // LIFO
  });

  it('DisposeBag - prefers dispose() when an object has both, disposing once', () => {
    const bag = DisposeBag.create();
    const calls: string[] = [];

    bag.add({ dispose: () => calls.push('dispose'), [Symbol.dispose]: () => calls.push('symbol') });
    bag.dispose();

    expect(calls).toEqual(['dispose']);
  });

  it('DisposeBag - disposes a SymbolDisposable added after dispose', () => {
    const bag = DisposeBag.create();
    bag.dispose();

    let disposed = false;
    bag.add({ [Symbol.dispose]: () => (disposed = true) });
    expect(disposed).toBe(true);
  });

  it('[Symbol.dispose]() - is an alias of dispose()', () => {
    const bag = DisposeBag.create();
    const entity = new Disposable();
    let teardowns = 0;
    entity.autoDispose(() => teardowns++);

    bag[Symbol.dispose]();
    entity[Symbol.dispose]();
    entity.dispose(); // idempotent

    expect(bag.disposed).toBe(true);
    expect(entity.disposed).toBe(true);
    expect(teardowns).toBe(1);
  });

  it('using - disposes at scope exit, also on throw', () => {
    let entity: Disposable | undefined;
    let teardowns = 0;

    expect(() => {
      using scoped = new Disposable();
      entity = scoped;
      scoped.autoDispose(() => teardowns++);
      throw new Error('boom');
    }).toThrow('boom');

    expect(entity?.disposed).toBe(true);
    expect(teardowns).toBe(1);
  });
});

describe('Unsubscribable interop', () => {
  it('isUnsubscribable - detects unsubscribe()', () => {
    expect(isUnsubscribable(new Subject<string>().subscribe())).toBe(true);
    expect(isUnsubscribable({ unsubscribe: () => undefined })).toBe(true);
    expect(isUnsubscribable({ dispose: () => undefined })).toBe(false);
    expect(isUnsubscribable(null)).toBe(false);
  });

  it('DisposeBag - unsubscribes an rxjs Subscription on dispose', () => {
    const bag = DisposeBag.create();
    const subject$ = new Subject<string>();
    const values: string[] = [];
    const sub = bag.add(subject$.subscribe((v) => values.push(v)));

    subject$.next('A');
    bag.dispose();
    subject$.next('B');

    expect(sub.closed).toBe(true);
    expect(values).toEqual(['A']);
  });

  it('DisposeBag - unsubscribes right away when added after dispose', () => {
    const bag = DisposeBag.create();
    bag.dispose();

    const sub = bag.add(new Subject<string>().subscribe());
    expect(sub.closed).toBe(true);
  });

  it('DisposeBag - prefers dispose() over unsubscribe(), tearing down once', () => {
    const bag = DisposeBag.create();
    const calls: string[] = [];

    bag.add({ dispose: () => calls.push('dispose'), unsubscribe: () => calls.push('unsubscribe') });
    bag.dispose();

    expect(calls).toEqual(['dispose']);
  });
});
