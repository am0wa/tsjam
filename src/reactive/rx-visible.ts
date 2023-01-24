import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RxDisposable } from './rx-disposable';

/**
 * Reactive Disposable Entity with build-in Visibility state.
 */
export class RxVisible extends RxDisposable {

  readonly shown$: Observable<'shown'>;
  readonly visible$: Observable<boolean>;

  private readonly _visible$ = new BehaviorSubject(false);

  /** prevents any changes on same value */
  #distinct = true

  constructor() {
    super();
    this.visible$ = this._visible$.asObservable();
    this.shown$ = this.visible$.pipe(filter(Boolean), map(() => 'shown'));

    this.autoDispose(() => this._visible$.complete());
  }

  hide = (): void => this.setVisible(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  show = (..._args: readonly any[]): void => this.setVisible(true);

  setVisible = (value: boolean): void => {
    if (value === this._visible$.value && this.#distinct) {
      return;
    }
    this._visible$.next(value);
  }

  get isVisible(): boolean {
    return this._visible$.value;
  }
}