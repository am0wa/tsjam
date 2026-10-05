/** Disposable interface to explicitly cleanup in order to avoid memory leaks. */
import { DisposeBag } from './dispose-bag.js';

/** Functional interface. */
export interface DisposableLike {
  /** Teardown logic. */
  dispose(): void;
}

/** Callback function that should be invoked on Dispose. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DisposeCallback = (...args: readonly any[]) => void;

/** Any object keyed by `[Symbol.dispose]()` – the ES `using` / `DisposableStack` protocol, accepted for interop. */
export type SymbolDisposable = globalThis.Disposable;

/** Anything with `unsubscribe()` – e.g. rxjs `Subscription`, structurally, no rxjs dependency. */
export interface UnsubscribableLike {
  unsubscribe(): void;
}

/** Anything a bag can tear down: `DisposableLike`, `SymbolDisposable`, `UnsubscribableLike` or a callback. */
export type Teardown = DisposableLike | SymbolDisposable | UnsubscribableLike | DisposeCallback;

/** Objects and functions – anything that can carry a method. */
const isObjectLike = (x: unknown): x is object => (typeof x === 'object' && x !== null) || typeof x === 'function';

export const isDisposable = (x: unknown): x is DisposableLike => {
  return isObjectLike(x) && 'dispose' in x && typeof x.dispose === 'function';
};

export const isUnsubscribable = (x: unknown): x is UnsubscribableLike => {
  return isObjectLike(x) && 'unsubscribe' in x && typeof x.unsubscribe === 'function';
};

/** Checks for the ES `[Symbol.dispose]()` method (false on engines without `Symbol.dispose`). */
export const isSymbolDisposable = (x: unknown): x is SymbolDisposable => {
  return (
    typeof Symbol.dispose === 'symbol' &&
    isObjectLike(x) &&
    Symbol.dispose in x &&
    typeof x[Symbol.dispose] === 'function'
  );
};

/**
 * Disposable entity to avoid memory Leaks.
 * Base abstraction with the instance of DisposeBag for life-cycle management of resources.
 * RIP any Disposable or invoke cleanup callback on the instance dispose.
 */
export class Disposable implements DisposableLike, SymbolDisposable {
  protected readonly _ripBag = DisposeBag.create();

  get disposed(): boolean {
    return this._ripBag.disposed;
  }

  /**
   * Kill all Disposable Objects
   * @param teardown
   */
  autoDispose<T extends Teardown>(teardown: T): T {
    return this._ripBag.add(teardown);
  }

  dispose(): void {
    this._ripBag.dispose();
  }

  /** Standard ES disposal (`using`), same as `dispose()`. */
  [Symbol.dispose](): void {
    this.dispose();
  }
}
