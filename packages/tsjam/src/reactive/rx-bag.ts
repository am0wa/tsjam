import type { Unsubscribable } from 'rxjs';
import { Subscription } from 'rxjs';

import type { DisposableBag, DisposeCallback, RipId, SymbolDisposable } from '../core/index.js';

export type UnsubscribeCallback = DisposeCallback;

/**
 * Reactive Subscriptions Management (self-pruning)
 * to unsubscribe from existing subscriptions and avoid Memory Leaks.
 * Never retains dead subscriptions – After 1000 subscribe-then-complete cycles it holds nothing.
 */
export class RxBag implements DisposableBag<Unsubscribable | UnsubscribeCallback>, SymbolDisposable {
  private static _counter = 0;

  public static create(): RxBag {
    return new RxBag(RxBag.generateId());
  }

  private static generateId(): RipId {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return RxBag._counter++ as RipId;
  }

  private readonly _sub$ = new Subscription();
  private _size = 0;
  private _closed = false;

  protected constructor(readonly id: RipId) {
    /* empty */
  }

  get size(): number {
    return this._size;
  }
  get disposed(): boolean {
    return this._closed;
  }

  /**
   * Adds subscription to sink, if disposed subscription will be flushed right-away.
   * A Subscription that ends early (complete / unsubscribe) is no longer counted in `size`.
   */
  readonly add = (subscription: Unsubscribable | UnsubscribeCallback): Unsubscribable | UnsubscribeCallback => {
    if (this._closed) {
      this._sub$.add(subscription); // flushed right-away, not counted
      return subscription;
    }
    if (subscription instanceof Subscription) {
      if (subscription.closed) {
        return subscription; // nothing to hold; must precede the wrapper – add() on a closed sub runs it at once
      }
      subscription.add(() => this._size--); // uncount when it ends, early or on dispose
    }
    this._sub$.add(subscription);
    this._size++;
    return subscription;
  };

  /**
   * Unsubscribe from all subscriptions,
   * any child subscriptions that were added to it are also unsubscribed.
   */
  dispose(): void {
    this._sub$.unsubscribe();
    this._size = 0;
    this._closed = true;
  }

  /** Standard ES disposal (`using`), same as `dispose()`. */
  [Symbol.dispose](): void {
    this.dispose();
  }
}
