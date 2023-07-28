import { Callback, Integer, SomeObject } from './types';

export const isString = (x: unknown): x is string => typeof x === 'string';

export const isNumber = (x: unknown): x is number => typeof x === 'number';

export const isInteger = (x: unknown): x is Integer => {
  return typeof x === 'number' && Number.isInteger(x);
};

export const isTrue = <T>(value: T): boolean => !!value;

export const isFalse = <T>(value: T): boolean => !value;

/**
 * Type guard (also great for rx `filter` operations), that restricts `undefined` or `null` values.
 */
export const isSomething = <T>(x: T | undefined | null): x is NonNullable<T> => {
  // Quick comparison with both undefined and null
  return x != null;
};

export const isObject = (item: unknown): item is SomeObject => {
  return item !== null && typeof item === 'object';
};

export const isCallback = (x: unknown): x is Callback => {
  return typeof x === 'function';
};

/** Shorthand for `Array.isArray(item)`. */
// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
export const isArrayLike = (item: unknown): item is any[] => {
  return Array.isArray(item);
};

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
export const isEmpty = <T>(collection: Iterable<T> | null | undefined): boolean => {
  if (collection == null) {
    return true;
  }

  const iterator = collection[Symbol.iterator]();
  return iterator.next().done === true;
};

/** Just a semantic sugar for filters */
export const isNotEmpty = <T>(collection: Iterable<T> | null | undefined): boolean => !isEmpty(collection);
