import { BehaviorSubject, type Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RxDisposable } from './rx-disposable.js';

/**
 * Reactive Disposable Entity with build-in Visibility state (hidden initially).
 * Streams replay the current state on subscribe and complete on `dispose()`; changes after dispose are ignored.
 */
export class RxVisible extends RxDisposable {
  /** Emits 'shown' whenever the entity becomes visible – right away on subscribe if it already is */
  readonly shown$: Observable<'shown'>;
  /** Emits the current visibility on subscribe, then true/false on every change */
  readonly visible$: Observable<boolean>;

  private readonly _visible$ = new BehaviorSubject(false);

  constructor() {
    super();
    this.visible$ = this._visible$.asObservable();
    this.shown$ = this.visible$.pipe(
      filter(Boolean),
      map(() => 'shown'),
    );

    this.autoDispose(() => this._visible$.complete());
  }

  /** Complexity: O(1). */
  readonly hide = (): void => this.setVisible(false);

  /** Accepts and ignores any arguments, so it can be passed straight as an event handler. Complexity: O(1). */
  readonly show = (..._args: readonly unknown[]): void => this.setVisible(true);

  /** Emits only on an actual change – setting the same value again is a no-op. Complexity: O(1). */
  readonly setVisible = (value: boolean): void => {
    if (value === this._visible$.value) {
      return;
    }
    this._visible$.next(value);
  };

  get isVisible(): boolean {
    return this._visible$.value;
  }
}
