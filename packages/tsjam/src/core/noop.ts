export const noop = (): void => {
  /* noop */
};

/**
 * Known _null object_ pattern for filter/map like functions
 * @returns exactly the same value passed the first parameter. */
export const identity = <T>(x: T): T => x;

/**
 * void 0 is effectively a compile time bulletproof constant for undefined with no look-up requirements.
 * difference is that some browsers allow to overwrite undefined, yet not void 0
 @example:
 readonly notification$: Observable<void>;
 ...
 notification$ = source$.pipe(
 mapTo(noValue)
 );
 */
export const noValue = void 0; // void(0) - literally undefined
