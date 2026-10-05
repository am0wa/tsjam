import { assert } from './assert.js';
import { roundTo } from './math.js';
import type { Opaque } from './types.js';

/**
 * % 0..100...N number.
 * In math a percentage `(x/y * 100)` is a number or ratio expressed as a fraction of 100.
 */
export type Percentage = Opaque<'Percentage', number>;

/** Brands a number as `Percentage`, no validation (see `assertWithin100`, `isPercentage`). */
export const toPercentage = (num: number): Percentage => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return num as Percentage;
};

/**
 * Creates Percentage asserting value is within 0..100 range.
 */
export const assertWithin100 = (num: number): Percentage => {
  assert(Math.abs(num) <= 100, `Expected value for Percentage between 0 and 100, got ${num}`);
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return num as Percentage;
};

/** Any finite number – a percentage may exceed 100 or be negative (growth, change); the brand is type-only. */
export const isPercentage = (x: unknown): x is Percentage => Number.isFinite(x);

/**
 * Calculates percentage `(part/total * 100)`
 * @param part
 * @param total
 * @param fractionDigits - digits after decimal place (2 by default).
 * The number is rounded if necessary. If negative - no rounding then.
 * Binary floating point applies: half cases like `1.005` may round down.
 */
export const calculatePercentage = (part: number, total: number, fractionDigits = 2): Percentage => {
  assert(total > 0, `Percentage total must be > 0, got ${total}`);
  const percentage = (part / total) * 100;
  if (fractionDigits < 0) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return percentage as Percentage;
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return roundTo(percentage, fractionDigits) as Percentage;
};
