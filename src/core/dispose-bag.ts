import { RipId } from 'core/types';

import { DisposableLike, DisposeCallback, isDisposable } from './disposable';

/**
 * Sink Like Entity for auto dispose.
 * @usage:
 *    const foo = this._ripBag.add(new Foo());
 */
export interface DisposableBag<T> extends DisposableLike {
  readonly id: RipId;
  readonly size: number;
  readonly disposed: boolean;
  add(disposable: T): T
  dispose(): void;
}

export class DisposeBag implements DisposableBag<DisposableLike | DisposeCallback> {

  public static dispose(disposable: DisposableLike | DisposeCallback): void {
    isDisposable(disposable) ? disposable.dispose() : disposable();
  }

  public static create(): DisposeBag {
    return new DisposeBag(DisposeBag.generateId());
  }

  private static _counter = 0;
  private static generateId(): RipId {
    return DisposeBag._counter++ as RipId
  }

  private readonly _disposables = new Array<DisposableLike | DisposeCallback>();
  private _registry: WeakSet<DisposableLike | DisposeCallback> | undefined; // registry erased after dispose
  private _disposed = false;

  protected constructor(readonly id: RipId) { this._registry = new WeakSet<DisposableLike | DisposeCallback>() }

  get size(): number { return this._disposables.length; }
  get disposed(): boolean { return this._disposed; }

  /**
   * If disposed - dispose adding object immediately
   * @param disposable - DisposableLike | DisposeCallback
   * @returns same disposable instance - convenient for one line declarations
   */
  add<T extends DisposableLike | DisposeCallback>(disposable: T): T {
    if (this._disposed) {
      DisposeBag.dispose(disposable);
      return disposable;
    }
    if (this._registry?.has(disposable)) {
      return disposable;
    }
    this._registry?.add(disposable);
    this._disposables.push(disposable);
    return disposable;
  }

  dispose(): void {
    if (this._disposed) {
      return; // already disposed.
    }
    this._disposables.forEach((disposable) => {
      DisposeBag.dispose(disposable);
      this._registry?.delete(disposable);
    })
    this._disposables.length = 0; // erase
    this._registry = undefined;   // erase
    this._disposed = true;        // finalize
  }
}
