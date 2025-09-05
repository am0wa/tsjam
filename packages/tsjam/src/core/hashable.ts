import { type Equatable, isEquatable } from './equatable.js';

/**
 * Hashable mimics Java native Object.hashCode implementation, which benefits hash tables such as those provided by HashMap
 * The general contract of hashCode() method is:
 *
 *    - Multiple invocations of hashCode() should return the same integer value, unless the object property is modified that is being used in the equals() method.
 *    - An object hash code value can change in multiple executions of the same application.
 *    - If two objects are equal according to equals() method, then their hash code must be same.
 *    - If two objects are unequal according to equals() method, their hash code are not required to be different.
 *    - Their hash code value may or may-not be equal.
 *
 * The implementation of equals() and hashCode() should follow these rules:
 *
 *    - If o1.equals(o2), then o1.hashCode() == o2.hashCode() should always be true.
 *    - If o1.hashCode() == o2.hashCode is true, it doesn’t mean that o1.equals(o2) will be true.
 */
export interface Hashable extends Equatable {
  /**
   * Returns a hash code value for the object
   */
  hashCode(): number;
}

export const isHashable = (x: unknown): x is Hashable => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/consistent-type-assertions
  return isEquatable(x) && typeof (x as any).hashCode === 'function';
};
