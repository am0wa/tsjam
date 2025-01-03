export interface Comparable<T, U = ComparisonResult> {
  compare(other: T): U;
}

export namespace Comparable {
  export const compare = <T extends Comparable<T, U>, U = ComparisonResult>(o1: T, o2: T): U => {
    return o1.compare(o2);
  };
}

export type Comparator<T, U = ComparisonResult> = (first: T, second: T) => U;
export enum ComparisonResult {
  /** (a < b) - ascending order */
  Lower = -1,
  Same = 0,
  /** (a > b) - descending order */
  Higher = 1,
}

export const comparePrimitives = <T extends number | string>(a: T, b: T): ComparisonResult => {
  // eslint-disable-next-line no-nested-ternary
  return a > b ? ComparisonResult.Higher : a < b ? ComparisonResult.Lower : ComparisonResult.Same;
};

export const compareStrings = (a: string, b: string, ignoreCase = true): ComparisonResult => {
  return comparePrimitives(ignoreCase ? a.toLowerCase() : a, ignoreCase ? b.toLowerCase() : b);
};
