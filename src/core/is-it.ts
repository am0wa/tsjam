import { Callback, Integer, SomeObject } from './types';

export function isString(x: unknown): x is string {
  return typeof x === 'string';
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number';
}

export function isInteger(x: unknown): x is Integer {
  return typeof x === 'number' && Number.isInteger(x);
}

export function isTrue(value: boolean): value is true {
  return value;
}

export function isFalse(value: boolean): value is false {
  return !value;
}

/**
 * Type guard (also great for rx `filter` operations), that restricts `undefined` or `null` values.
 */
export function isSomething<T>(x: T | undefined | null): x is NonNullable<T> {
  // Quick comparison with both undefined and null
  return x != null;
}

export function isObject(item: unknown): item is SomeObject {
  return item !== null && typeof item === 'object';
}

export function isCallback(x: unknown): x is Callback {
  return typeof x === 'function';
}

/** Shorthand for `Array.isArray(item)`. */
// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
export function isArrayLike(item: unknown): item is any[] {
  return Array.isArray(item);
}

/**
 * Checks Iterable like entities whether it's empty or not.
 * Time Complexity O(1).
 *
 * isEmpty(null) => true
 * isEmpty(undefined) => true
 * isEmpty('') => true
 * isEmpty([]) => true
 * isEmpty('ABC') => false
 * isEmpty('[A, B]') => false
 * isEmpty('new Map([[1, 'one']])') => false
 * isEmpty('new Set([[1, 'one']])') => false
 */
export function isEmpty<T>(collection: Iterable<T> | null | undefined): boolean {
  if (collection == null) {
    return true;
  }

  const iterator = collection[Symbol.iterator]();
  return iterator.next().done === true;
}

