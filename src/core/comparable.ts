export enum ComparisonResult {
  Ascending = -1,
  Same = 0,
  Descending = 1,
}

export type Comparator<T> = (first: T, second: T) => ComparisonResult;

export interface Comparable<T> {
  compare(other: T): ComparisonResult;
}

export namespace Comparable {
  export function comparePrimitives<T extends number | string>(a: T, b: T): ComparisonResult {
    return a > b
      ? ComparisonResult.Descending
      : a < b
        ? ComparisonResult.Ascending
        : ComparisonResult.Same;
  }

  export function compareStrings(a: string, b: string, caseInsensitive = true): ComparisonResult {
    return comparePrimitives(
      caseInsensitive ? a.toLowerCase() : a,
      caseInsensitive ? b.toLowerCase() : b
    );
  }
}
