/** Does nothing – a stub for optional callbacks. Complexity: O(1). */
export const noop = (): void => {
  /* noop */
};

/**
 * Known _null object_ pattern for filter/map like functions
 * @returns exactly the same value passed the first parameter.
 * Complexity: O(1)
 */
export const identity = <T>(x: T): T => x;

/**
 * Explicit "no value" – literally `undefined`, named to state intent.
 * @example
 *   readonly notification$: Observable<void>;
 *   notification$ = source$.pipe(map(() => noValue));
 */
export const noValue = void 0;
