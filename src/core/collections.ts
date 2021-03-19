export namespace Collections {
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
}

