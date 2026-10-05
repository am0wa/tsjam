import type { Integer } from './types.js';

/**
 * List & Map helpers – plain module exports, tree-shakable.
 * @usage:
 *    import * as Collections from 'tsjam/collections'; // tree-shakes in every bundler
 *    import { Collections } from 'tsjam'; // same group via the barrel (esbuild keeps the whole group)
 */

export type Slice = {
  /** inclusive */
  readonly start: Integer;
  /** exclusive */
  readonly end?: Integer;
};
/**
 * Returns first element from list.
 * Complexity: O(1).
 */
export const first = <T>(list: readonly T[] | undefined | null): T | undefined => {
  return list?.at(0);
};
/**
 * Returns last element from list.
 * Complexity: O(1).
 */
export const last = <T>(list: readonly T[] | undefined | null): T | undefined => {
  return list?.at(-1);
};
/**
 * Returns copy of list without the N last elements (N <= 0 removes nothing).
 * Complexity: O(n) time and space – copies the rest.
 */
export const removeLast = <T>(list: readonly T[], N: Integer = 1): readonly T[] => {
  return N > 0 ? list.slice(0, -N) : list.slice();
};
/**
 * Returns copy of list without the first element.
 * Complexity: O(n) time and space – copies the rest.
 */
export const removeFirst = <T>(list: readonly T[]): readonly T[] => {
  return list.slice(1);
};
/**
 * Return a random element from the list.
 * Complexity: O(1).
 */
export function random<T>(list: readonly T[]): T | undefined;
export function random<T>(list: readonly T[], fallback: T): T;
export function random<T>(list: readonly T[], fallback?: T): T | undefined {
  if (list.length === 0) {
    return fallback;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

/**
 * Returns copy of list without duplicates (SameValueZero, first occurrence wins).
 * Complexity: O(n) time and space.
 */
export const distinct = <T>(list: readonly T[]): readonly T[] => {
  return [...new Set(list)];
};

/**
 * Returns copy of list without the slice; bounds work like `slice` (negative = from the end, start >= end removes nothing).
 * Complexity: O(n) – a single copy via ES2023 `toSpliced`.
 */
export const removeSlice = <T>(list: readonly T[], { start, end }: Slice): readonly T[] => {
  if (end === undefined) {
    return list.toSpliced(start);
  }
  const { length } = list;
  const from = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);
  const to = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);
  return list.toSpliced(from, Math.max(to - from, 0));
};

/**
 * Same items in the same order, compared by `Object.is` (NaN equals NaN) unless `equalityTest` is given.
 * Complexity: O(n) time (stops at the first mismatch), O(1) space.
 * @usage:
 *    Collections.areEqual(usersA, usersB, (a, b) => a.id === b.id);
 */
export const areEqual = <T>(
  list1: readonly T[] = [],
  list2: readonly T[] = [],
  equalityTest: (a: T, b: T) => boolean = Object.is,
): boolean => {
  return list1.length === list2.length && list1.every((item, idx) => equalityTest(item, list2[idx]));
};

/**
 * Same items regardless of order, duplicates count: ['A', 'A', 'B'] != ['A', 'B', 'B'].
 * Complexity: O(n) time and space – one `Map` count per key (plus the cost of `keyOf`).
 * @param keyOf - identity of an item, compared by SameValueZero (NaN equals NaN); defaults to the item itself.
 * @usage:
 *    Collections.equalByContent(usersA, usersB, (user) => user.id);
 */
export const equalByContent = <T>(
  listA: readonly T[] = [],
  listB: readonly T[] = [],
  keyOf: (item: T) => unknown = (item) => item,
): boolean => {
  if (listA.length != listB.length) {
    return false;
  }

  const counts = new Map<unknown, number>();
  listA.forEach((a) => {
    const key = keyOf(a);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return listB.every((b) => {
    const key = keyOf(b);
    const n = counts.get(key);
    if (!n) {
      return false;
    }
    counts.set(key, n - 1);
    return true;
  });
};

/**
 * Swaps keys and values; on duplicate values the last key wins.
 * Complexity: O(n) time and space.
 */
export const invertMap = <K, V>(map: Map<K, V>): Map<V, K> => new Map(Array.from(map, (entry) => [entry[1], entry[0]]));
