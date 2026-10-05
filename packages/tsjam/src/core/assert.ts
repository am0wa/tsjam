import { AssertionError } from './errors.js';
import type { NonEmptyString } from './types.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __DEVELOPMENT__: boolean;

/**
 * Runtime invariant: throws `AssertionError` when `expression` is falsy, narrowing it to truthy otherwise.
 * A function `expression` is invoked and its result checked.
 * Complexity: O(1) plus the cost of a function `expression`.
 */
export function assert(expression: unknown, message?: string): asserts expression {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const condition = typeof expression === 'function' ? expression() : expression;
  if (!condition) {
    throw new AssertionError(`assert: ${message ?? 'Unexpected condition'} :${'' + condition}`);
  }
}

export namespace assert {
  /** For exhaustive switches: compile-time check via `never`, throws if reached at runtime. Complexity: O(1). */
  export const never = (x: never): never => {
    throw new AssertionError(`assertNever: ${String(x)}`); // String() – a template literal throws on Symbols
  };

  /** Throws AssertionError if value is `null` or `undefined`. Complexity: O(1). */
  export function exists<T>(x: T, message: string): asserts x is NonNullable<T> {
    if (x == null) {
      throw new AssertionError(`assertExists: ${message}`);
    }
  }

  /** throws AssertionError If value doesn't exist or is empty string (trim outside if needed). Complexity: O(1). */
  export function nonEmptyString(x: string | null | undefined, assertion: string): asserts x is NonEmptyString {
    if (x == null || x.length === 0) {
      throw new AssertionError(`assertNonEmptyString: ${assertion}`);
    }
  }

  /**
   * Asserts only when the `__DEVELOPMENT__` global is `true`; pass a function to skip evaluating it in production.
   * Note: TypeScript narrows the type even in production, where the check does not run.
   * Complexity: O(1) plus the cost of a function `expression` (dev only).
   */
  export function dev(expression: boolean | (() => boolean), message?: string): asserts expression {
    // `typeof` guard: consumers that don't define the global must not crash with ReferenceError
    if (typeof __DEVELOPMENT__ !== 'undefined' && __DEVELOPMENT__) {
      assert(expression, message);
    }
  }
}
