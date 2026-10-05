/**
 * Passes `value` through `fns` left to right; each step may change the type.
 * Complexity: O(k) for k steps.
 * @usage:
 *    pipeline('42', Number, (n) => n * 2); // 84
 */
export function pipeline<A>(value: A): A;
export function pipeline<A, B>(value: A, ab: (a: A) => B): B;
export function pipeline<A, B, C>(value: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipeline<A, B, C, D>(value: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
export function pipeline<A, B, C, D, E>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E;
export function pipeline<T>(value: T, ...fns: ((arg: T) => T)[]): T;
export function pipeline(value: unknown, ...fns: ((arg: unknown) => unknown)[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/** Negates a predicate, e.g. `list.filter(not(isEmpty))`. */
export const not =
  <T>(expression: (t: T) => boolean) =>
  (t: T): boolean =>
    !expression(t);
