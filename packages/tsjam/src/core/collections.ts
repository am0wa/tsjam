import type { Integer } from './types.js';

export namespace Collections {
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
    return list?.length ? list[0] : undefined;
  };
  /**
   * Returns last element from list.
   * Complexity: O(1).
   */
  export const last = <T>(list: readonly T[] | undefined | null): T | undefined => {
    return list ? list[list.length - 1] : undefined;
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
    const { length } = list;
    return list.slice(length > 0 ? 1 : 0);
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
   * Returns copy of list without Slice.
   * A negative index can be used, indicating an offset from the end of the sequence.
   * removeSlice([...], { start: -2 }) removes the last two elements in the sequence.
   * Complexity: O(n) time and space.
   */
  export const removeSlice = <T>(list: readonly T[], { start, end }: Slice): readonly T[] => {
    return end === undefined ? list.slice(0, start) : [...list.slice(0, start), ...list.slice(end)];
  };

  /**
   * Same items in the same order.
   * Complexity: O(n) with `equalityTest` (stops at the first mismatch);
   * without it O(size of both lists serialized) via `JSON.stringify`.
   */
  export const areEqual = <T>(
    list1: readonly T[] = [],
    list2: readonly T[] = [],
    equalityTest?: (a: T, b: T) => boolean,
  ): boolean => {
    if (list1.length != list2.length) {
      return false;
    }

    if (!equalityTest) {
      return JSON.stringify(list1) === JSON.stringify(list2);
    }

    return !list1.some((obj, idx) => !equalityTest(obj, list2[idx]));
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
  export const invertMap = <K, V>(map: Map<K, V>): Map<V, K> =>
    new Map(Array.from(map, (entry) => [entry[1], entry[0]]));
}
