export const noop = (): void => { /* noop */ };

/** Returns exactly same value - acts as null object patter for dynamic mappings */
export const passThrough = <T>(value: T):T => value;

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
