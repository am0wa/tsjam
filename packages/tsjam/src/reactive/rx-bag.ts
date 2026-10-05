import { Subscription } from 'rxjs';
import type { Unsubscribable } from 'rxjs';

import type { DisposableBag, DisposeCallback, RipId, SymbolDisposable } from '../core/index.js';

export type UnsubscribeCallback = DisposeCallback;

/**
 * Reactive Subscriptions Management
 * to unsubscribe from existing subscriptions and avoid Memory Leaks.
 * @deprecated Use `DisposeBag` – it tears down Subscriptions (anything with `unsubscribe()`) too. Removed in 2.0.
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
   */
  readonly add = (subscription: Unsubscribable | UnsubscribeCallback): Unsubscribable | UnsubscribeCallback => {
    this._sub$.add(subscription);
    if (subscription instanceof Subscription) {
      // we don't add closed subscriptions twice
      if (subscription.closed) {
        return subscription;
      }
    }
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
