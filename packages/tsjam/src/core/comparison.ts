/** Normalized comparison outcome. */
export const ComparisonResult = {
  /** (a < b) - ascending order */
  Lower: -1,
  Same: 0,
  /** (a > b) - descending order */
  Higher: 1,
} as const;
export type ComparisonResult = (typeof ComparisonResult)[keyof typeof ComparisonResult];

/** Standard JS comparator contract (`Array.prototype.sort`, `Intl.Collator`): negative, zero or positive. */
export type Comparator<T> = (first: T, second: T) => number;

export interface Comparable<T> {
  /** Negative if `this` sorts before `other`, zero if equal, positive if after. */
  compare(other: T): number;
}

export namespace Comparable {
  /** Comparator over `Comparable` items – e.g. `items.sort(Comparable.compare)`. */
  export const compare = <T extends Comparable<T>>(o1: T, o2: T): number => {
    return o1.compare(o2);
  };
}

export const comparePrimitives = <T extends number | string>(a: T, b: T): ComparisonResult => {
  // eslint-disable-next-line no-nested-ternary
  return a > b ? ComparisonResult.Higher : a < b ? ComparisonResult.Lower : ComparisonResult.Same;
};

export const compareStrings = (a: string, b: string, ignoreCase = true): ComparisonResult => {
  return comparePrimitives(ignoreCase ? a.toLowerCase() : a, ignoreCase ? b.toLowerCase() : b);
};
