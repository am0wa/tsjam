import type { Integer } from './types';

export namespace Collections {
  const equalsByRef = <T>(a: T, b: T): boolean => a === b;

  export type Slice = {
    /** inclusive */
    readonly start: Integer;
    /** exclusive */
    readonly end?: Integer;
  };
  /**
   * Returns first element from list.
   */
  export const first = <T>(list: readonly T[] | undefined | null): T | undefined => {
    return list?.length ? list[0] : undefined;
  };
  /**
   * Returns last element from list.
   */
  export const last = <T>(list: readonly T[] | undefined | null): T | undefined => {
    return list ? list[list.length - 1] : undefined;
  };
  /**
   * Returns copy of list without the N last elements.
   */
  export const removeLast = <T>(list: readonly T[], N: Integer = 1): readonly T[] => {
    return list.slice(0, -1 * N);
  };
  /**
   * Returns copy of list without the first element.
   */
  export const removeFirst = <T>(list: readonly T[]): readonly T[] => {
    const { length } = list;
    return list.slice(length > 0 ? 1 : 0);
  };
  /**
   * Return a random element from the list.
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
   * Returns copy of list without duplicates.
   */
  export const distinct = <T>(list: readonly T[]): readonly T[] => {
    return [...new Set(list)];
  };

  /**
   * Returns copy of list without Slice.
   * A negative index can be used, indicating an offset from the end of the sequence.
   * removeSlice([...], { start: -2 }) removes the last two elements in the sequence.
   */
  export const removeSlice = <T>(list: readonly T[], { start, end }: Slice): readonly T[] => {
    return end === undefined ? list.slice(0, start) : [...list.slice(0, start), ...list.slice(end)];
  };

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

  export const equalByContent = <T>(
    listA: readonly T[] = [],
    listB: readonly T[] = [],
    equalityTest: (a: T, b: T) => boolean = equalsByRef,
  ): boolean => {
    if (listA.length != listB.length) {
      return false;
    }

    const someDiffA = listA.find((a) => !listB.some((b) => equalityTest(a, b)));
    const someDiffB = listB.find((a) => !listA.some((b) => equalityTest(a, b)));

    return !someDiffA && !someDiffB;
  };

  export const invertMap = <K, V>(map: Map<K, V>): Map<V, K> =>
    new Map(Array.from(map, (entry) => [entry[1], entry[0]]));
}
