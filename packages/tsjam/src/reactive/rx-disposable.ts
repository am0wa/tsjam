import { type Observable, Subject, type Unsubscribable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Disposable, DisposeBag, isUnsubscribable, type Teardown } from '../core/index.js';
import { RxBag } from './rx-bag.js';

/** Moved to core – re-exported to keep `tsjam/reactive` imports working. */
export { isUnsubscribable } from '../core/index.js';

/**
 * Reactive Disposable Entity to avoid memory Leaks (self-pruning subs).
 * Base reactive abstraction with the instance of RxBag for life-cycle management of resources.
 * RIP any Disposable or Subscription on the instance dispose.
 */
export class RxDisposable extends Disposable {
  protected readonly _rxBag = RxBag.create();
  private readonly _disposed$ = new Subject<void>();

  /** Emits when the object was disposed */
  get disposed$(): Observable<void> {
    return this._disposed$;
  }

  /**
   * Kills all Disposable objects and Subscriptions. Invokes all teardown callbacks.
   * Teardown errors are rethrown once everything is disposed and `disposed$` has emitted.
   */
  override dispose(): void {
    try {
      DisposeBag.disposeAll([
        this._rxBag, // kill all subscriptions
        () => super.dispose(), // kill all children
      ]);
    } finally {
      this._disposed$.next(); // emmit disposed to subscribers
      this._disposed$.complete(); // finalize
    }
  }

  /**
   * Automatically teardown any Disposable or Subscription on the instance dispose.
   * @param teardown - any subscription, DisposableLike or SymbolDisposable object, or callback.
   * @returns same instance so you could assign it smoothly in same line.
   */
  override autoDispose<T extends Unsubscribable | Teardown>(teardown: T): T {
    if (isUnsubscribable(teardown)) {
      this._rxBag.add(teardown);
      return teardown;
    }
    return super.autoDispose(teardown);
  }

  /**
   * The way to auto-complete public streams when entity is disposed
   */
  autoComplete$<T>(stream: Observable<T>): Observable<T> {
    return stream.pipe(takeUntil(this._disposed$));
  }
}
