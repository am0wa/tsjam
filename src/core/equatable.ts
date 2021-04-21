/**
 * The equals method should implement an equivalence relation on non-null object references:
 *
 *    - It is reflexive: for any non-null reference value x, x.equals(x) should return true.
 *    - It is symmetric: for any non-null reference values x and y, x.equals(y) should return true if and
 *    only if y.equals(x) returns true.
 *    - It is transitive: for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z)
 *    returns true, then x.equals(z) should return true.
 *    - It is consistent: for any non-null reference values x and y, multiple invocations of x.equals(y)
 *    consistently return true or consistently return false, provided no information used in equals
 *    comparisons on the objects is modified.
 *    - For any non-null reference value x, x.equals(null) should return false.
 */
export interface Equatable {
  equals(other: unknown): boolean;
}

export const isEquatable = (x: unknown): x is Equatable => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!x && typeof (x as any).equals === 'function';
};

export namespace Equatable {
  export function areEqualByRef(o1: unknown, o2: unknown): boolean {
    return o1 === o2;
  }
  
  export function areEqual<T extends Equatable>(o1: T, o2: T): boolean {
    return o1.equals(o2);
  }
}
