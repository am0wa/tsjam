import { isSomething } from './is-it.js';

/**
 * Applies map function to `optionalValue` if it contains value, otherwise returns undefined
 * Complexity: O(1) plus the cost of `mapper`.
 */
export function optionalMap<T, U>(
  optionalValue: T | undefined | null,
  mapper: (nonOpt: NonNullable<T>) => U,
): U | undefined;

/**
 * Applies map function to `optionalValue` if it contains value, otherwise returns default.
 * The default applies to a missing (`null` / `undefined`) input only – not to what `mapper` returns.
 * Complexity: O(1) plus the cost of `mapper`.
 */
export function optionalMap<T, U>(
  optionalValue: T | undefined | null,
  mapper: (nonOpt: NonNullable<T>) => U,
  defaultValue: U,
): U;

export function optionalMap<T, U>(
  optionalValue: T | undefined | null,
  mapper: (nonOpt: NonNullable<T>) => U,
  defaultValue?: U,
): U | undefined {
  return isSomething(optionalValue) ? mapper(optionalValue) : defaultValue;
}
