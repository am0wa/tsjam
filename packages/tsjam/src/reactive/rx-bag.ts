import { Subscription } from 'rxjs';
import type { Unsubscribable } from 'rxjs/internal/types';
import type { DisposableBag, DisposableLike, DisposeCallback, RipId } from '../core/index.js';

export type UnsubscribeCallback = DisposeCallback;

/**
 * Reactive Subscriptions Management
 * to unsubscribe from existing subscriptions and avoid Memory Leaks.
 */
export class RxBag implements DisposableBag<Unsubscribable | UnsubscribeCallback> {
  private static readonly all = new Map<RipId, DisposableLike>();
  private static _counter = 0;

  public static create(): RxBag {
    const one = new RxBag(RxBag.generateId());
    RxBag.all.set(one.id, one);
    return one;
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
    RxBag.all.delete(this.id); // cleans up its reference
  }
}
