/** Disposable interface to explicitly cleanup in order to avoid memory leaks. */
import { DisposeBag } from './dispose-bag';

/** Functional interface. */
export interface DisposableLike {
  /** Teardown logic. */
  dispose(): void;
}

/** Callback function that should be invoked on Dispose. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DisposeCallback = (...args: readonly any[]) => void;

export const isDisposable = (x: unknown): x is DisposableLike => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!x && typeof (x as any).dispose === 'function';
};

/**
 * Disposable entity to avoid memory Leaks.
 * Base abstraction with the instance of DisposeBag for life-cycle management of resources.
 * RIP any Disposable or invoke cleanup callback on the instance dispose.
 */
export class Disposable implements DisposableLike {
  protected readonly _ripBag = DisposeBag.create();

  get disposed(): boolean { return this._ripBag.disposed }

  /**
   * Kill all Disposable Objects
   * @param teardown
   */
  autoDispose<T extends DisposableLike | DisposeCallback>(teardown: T): T {
    return this._ripBag.add(teardown);
  }

  dispose(): void { this._ripBag.dispose() }
}
