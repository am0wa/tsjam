import { AssertionError } from './errors';

declare const __DEVELOPMENT__: boolean;

// Given JavaScript's flexibility, it can be a good idea to add
// runtime checks to your code to validate your assumptions.

// These are typically called assertions (or invariants) and
// they are small functions which raise errors early when
// your variables don't match up to what you expect.

// Node comes with a function for doing this out of the box,
// it's called assert and it's available without an import.
// We're going to define our own though. This declares a
// function which asserts that the expression called
// value is true:

export function assert(expression: unknown, message?: string): asserts expression {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const condition = typeof expression === 'function' ? expression() : expression;
  if (!condition) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    throw new AssertionError(`assert: ${message ?? 'Unexpected condition'} :${'' + condition}`);
  }
}

export namespace assert {
  export function never(x: never): never {
    throw new AssertionError(`assertNever: ${x}`);
  }

  export function exists<T>(x: T, message: string): asserts x is NonNullable<T> {
    if (x == null) {
      throw new AssertionError(`assertExists: ${message}`);
    }
  }

  export function dev(expression: boolean | (() => boolean), message?: string): asserts expression {
    if (__DEVELOPMENT__) {
      assert(expression, message);
    }
  }
}
