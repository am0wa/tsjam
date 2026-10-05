import { assertExists, assertNonEmptyString } from './assert.js';
import type { NonEmptyString, SomeObject } from './types.js';

/** Util to narrow types of incoming data – plain module exports, grouped as `unwrap` by the barrel (`export * as unwrap`). */

/** @returns NonNullable value - if value doesn't exist throws assertExist AssertionError */
export const expected = <T>(value: T | undefined | null, assertion: string): NonNullable<T> => {
  assertExists(value, assertion);
  return value;
};

/** @returns NonEmptyString - if value doesn't exist or isEmpty throws AssertionError */
export const id = (value: string | null | undefined, assertion: string): NonEmptyString => {
  assertNonEmptyString(value, assertion);
  return value;
};

/**
 * Handy in exhaustive switches (in <code>default</code> case) of enums values,
 * so that we have compilation-time exhaustive check (via <code>never</code> argument).
 * We return <code>undefined</code> instead of throwing error (e.g. via <code>assertNever()</code>) to support
 * unexpected values in case third party goes ahead in protocol implementation -- in this case we should ignore
 * respective part of protocol message based on <code>undefined</code> result of parsing.
 */
export const normalizeUnsupported = (_x: never): undefined => {
  return undefined;
};

/**
 * Checks whether property is own (not inherited) on object and returns its value.
 * Gives compilation-time check for the existence of key in the specified type.
 */
export const ownProperty = <T extends SomeObject, K extends keyof T>(obj: T, prop: K): T[K] | undefined => {
  return Object.hasOwn(obj, prop) ? obj[prop] : undefined;
};
