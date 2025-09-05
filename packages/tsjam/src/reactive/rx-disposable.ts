import { type Observable, Subject } from 'rxjs';
import type { Unsubscribable } from 'rxjs/internal/types';
import { takeUntil } from 'rxjs/operators';

import { Disposable, type DisposableLike, type DisposeCallback, isCallback, isDisposable } from '../core/index.js';
import { RxBag } from './rx-bag.js';

export const isUnsubscribable = (x: unknown): x is Unsubscribable => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/consistent-type-assertions
  return !!x && typeof (x as any).unsubscribe === 'function';
};

/**
 * Reactive Disposable Entity to avoid memory Leaks.
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
   * Kills all Disposable objects and Subscriptions.
   * Invokes all teardown callbacks.
   */
  override dispose(): void {
    this._rxBag.dispose(); // kill all subscriptions
    super.dispose(); // kill all children
    this._disposed$.next(); // emmit disposed to subscribers
    this._disposed$.complete(); // finalize
  }

  /**
   * Automatically teardown any Disposable or Subscription on the instance dispose.
   * @param teardown - any subscription or disposable like object or callback.
   * @returns same instance so you could assign it smoothly in same line.
   */
  override autoDispose<T extends Unsubscribable | DisposableLike | DisposeCallback>(teardown: T): T {
    if (isUnsubscribable(teardown)) {
      this._rxBag.add(teardown);
      return teardown;
    }
    if (isDisposable(teardown) || isCallback(teardown)) {
      return super.autoDispose(teardown);
    }
    return teardown;
  }

  /**
   * The way to auto-complete public streams when entity is disposed
   */
  autoComplete$<T>(stream: Observable<T>): Observable<T> {
    return stream.pipe(takeUntil(this._disposed$));
  }
}
