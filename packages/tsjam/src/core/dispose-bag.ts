import type { DisposableLike, SymbolDisposable, Teardown } from './disposable.js';
import type { RipId } from './types.js';

/**
 * Sink Like Entity for auto dispose.
 * @usage:
 *    const foo = this._ripBag.add(new Foo());
 */
export interface DisposableBag<T> extends DisposableLike {
  readonly id: RipId;
  readonly size: number;
  readonly disposed: boolean;
  add(disposable: T): T;
  dispose(): void;
}

/**
 * Bag of teardowns disposed together, reverse disposal (LIFO), no Leaks.
 *
 * Over the native `DisposableStack`:
 * - universal one `add()` for `dispose()`, `[Symbol.dispose]()`, `unsubscribe()` (rxjs) and callbacks – no `adopt`/`defer` wrapping
 * - laconic: `add()` returns the item itself for any kind – `const sub = bag.add(source$.subscribe(render))`
 * - duplicates are disposed once; adding after dispose disposes right away instead of throwing
 * - `delete()` releases an item without disposing it (self-pruning); `size` & `id` for smooth debugging
 * - works on every supported runtime (Node 22, Safari) – no polyfill
 *
 * @usage:
 *    const bag = DisposeBag.create();
 *    bag.add(source$.subscribe(render));
 *    bag.add(() => timer.stop());
 *    bag.dispose(); // timer.stop() first, then unsubscribe
 *
 *    using scoped = DisposeBag.create(); // disposed automatically when the block ends
 */
export class DisposeBag implements DisposableBag<Teardown>, SymbolDisposable {
  /**
   * Prefers `dispose()`, then `[Symbol.dispose]()`, then `unsubscribe()`, otherwise invokes the callback.
   * Input is already a `Teardown`, so a plain `in` check narrows it – no runtime guards needed.
   */
  public static dispose(disposable: Teardown): void {
    if ('dispose' in disposable) {
      disposable.dispose();
      return;
    }

    if (Symbol.dispose in disposable) {
      disposable[Symbol.dispose]();
      return;
    }

    if ('unsubscribe' in disposable) {
      disposable.unsubscribe();
      return;
    }

    disposable();
  }

  /**
   * Disposes every item, even if some of them throw.
   * Rethrows the single error as is, or an `AggregateError` of all of them.
   */
  public static disposeAll(disposables: Iterable<Teardown>): void {
    const errors: unknown[] = [];
    for (const disposable of disposables) {
      try {
        DisposeBag.dispose(disposable);
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw new AggregateError(errors, `DisposeBag: ${errors.length} teardowns failed`);
    }
  }

  public static create(): DisposeBag {
    return new DisposeBag(DisposeBag.generateId());
  }

  private static _counter = 0;
  private static generateId(): RipId {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return DisposeBag._counter++ as RipId;
  }

  /**
   * Insertion ordered, duplicates ignored; disposed in reverse (LIFO).
   * Why LIFO: something registered later usually depends on something registered earlier.
   */
  private readonly _disposables = new Set<Teardown>();
  private _disposed = false;

  readonly id: RipId;

  protected constructor(id: RipId) {
    this.id = id;
  }

  get size(): number {
    return this._disposables.size;
  }
  get disposed(): boolean {
    return this._disposed;
  }

  /**
   * If disposed - dispose adding object immediately
   * @param disposable - DisposableLike | SymbolDisposable | UnsubscribableLike | DisposeCallback
   * @returns same disposable instance - convenient for one line declarations
   */
  add<T extends Teardown>(disposable: T): T {
    if (this._disposed) {
      DisposeBag.dispose(disposable);
      return disposable;
    }
    this._disposables.add(disposable); // no-op if already added
    return disposable;
  }

  /**
   * Releases the item from the bag without disposing it,
   * e.g. when it was torn down early, so a long-lived bag doesn't keep holding it.
   * @returns true if the item was in the bag
   */
  delete(disposable: Teardown): boolean {
    return this._disposables.delete(disposable);
  }

  /**
   * Disposes all added items in reverse order (LIFO, like `DisposableStack`): the last added goes first,
   * since later items usually depend on earlier ones. Continues even if some throw (errors are rethrown afterwards).
   * Items added during disposal are disposed immediately.
   */
  dispose(): void {
    if (this._disposed) {
      return; // already disposed.
    }
    this._disposed = true; // finalize first: re-entrant `add` disposes right away
    try {
      DisposeBag.disposeAll(Array.from(this._disposables).reverse());
    } finally {
      this._disposables.clear(); // erase, even if some teardown threw
    }
  }

  /** Standard ES disposal (`using`), same as `dispose()`. */
  [Symbol.dispose](): void {
    this.dispose();
  }
}
