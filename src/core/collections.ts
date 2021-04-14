import { Integer } from './types';

export namespace Collections {
  export type Slice = {
    /** inclusive */
    readonly start: Integer,
    /** exclusive */
    readonly end?: Integer
  }
  /**
   * Returns first element from list.
   */
  export function first<T>(list: readonly T[] | undefined | null): T | undefined {
    return list ? list[0] : undefined;
  }
  /**
   * Returns last element from list.
   */
  export function last<T>(list: readonly T[] | undefined | null): T | undefined {
    return list ? list[list.length - 1] : undefined;
  }
  /**
   * Returns copy of list without the last element.
   */
  export function removeLast<T>(list: readonly T[]): readonly T[] {
    const { length } = list;
    return list.slice(0, length - 1);
  }
  /**
   * Returns copy of list without the first element.
   */
  export function removeFirst<T>(list: readonly T[]): readonly T[] {
    const { length } = list;
    return list.slice(length > 0 ? 1 : 0);
  }

  /**
   * Returns copy of list without Slice.
   * A negative index can be used, indicating an offset from the end of the sequence.
   * removeSlice([...], { start: -2 }) removes the last two elements in the sequence.
   */
  export function removeSlice<T>(list: readonly T[], { start, end }: Slice): readonly T[] {
    return end === undefined
      ? list.slice(0, start)
      : [
        ...list.slice(0, start),
        ...list.slice(end)
      ]
  }
}

