import { assert } from './assert';
import { SomeObject } from './types';

/**
 * Util to Narrow types of incoming Data, handy for usage for incoming data handling.
 */
export namespace unwrap {
  /** @returns NonNullable value - if value doesn't exist throws assertExist AssertionError */
  export const expected = <T>(value: T | undefined | null, assertion: string): NonNullable<T> => {
    assert.exists(value, assertion);
    return value;
  };

  /**
   * Handy in exhaustive switches (in <code>default</code> case) of enums values,
   * so that we have compilation-time exhaustive check (via <code>never</code> argument).
   * We return <code>undefined</code> instead of throwing error (e.g. via <code>assertNever()</code>) to support
   * unexpected values in case third party goes ahead in protocol implementation -- in this case we should ignore
   * respective part of protocol message based on <code>undefined</code> result of parsing.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function normalizeUnsupported(_x: never): undefined {
    return undefined;
  }

  /**
   * Checks whether property is on object and returns its value.
   * Gives compilation-time check for the existence of key in the specified type.
   */
  export function ownProperty<T extends SomeObject, K extends keyof T>(
    obj: T,
    prop: K
  ): T[K] | undefined {
    return prop in obj ? obj[prop] : undefined;
  }
}

