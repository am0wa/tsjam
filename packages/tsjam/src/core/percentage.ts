import { assert } from './assert.js';
import type { Opaque } from './types.js';

/**
 * % 0..100...N number.
 * In math a percentage `(x/y * 100)` is a number or ratio expressed as a fraction of 100.
 */
export type Percentage = Opaque<'Percentage', number>;

export namespace Percentage {
  /** Complexity: O(1). */
  export const fromNumber = (num: number): Percentage => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return num as Percentage;
  };

  /**
   * Creates Percentage asserting value is within 0..100 range.
   * Complexity: O(1).
   */
  export const within100 = (num: number): Percentage => {
    assert(Math.abs(num) <= 100, `Expected value for Percentage between 0 and 100, got ${num}`);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return num as Percentage;
  };

  /** Any finite number (`NaN` / `Infinity` are not percentages). Complexity: O(1). */
  export const isIt = (x: unknown): x is Percentage => {
    return Number.isFinite(x);
  };

  /**
   * Calculates percentage `(part/total * 100)`
   * @param part
   * @param total
   * @param fractionDigits - digits after decimal place (2 by default).
   * The number is rounded if necessary. If negative - no rounding then.
   * Binary floating point applies: half cases like `1.005` may round down.
   * Complexity: O(1).
   */
  export const calculate = (part: number, total: number, fractionDigits = 2): Percentage => {
    assert(total > 0, `Percentage total must be > 0, got ${total}`);
    const percentage = (part / total) * 100;
    if (fractionDigits < 0) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return percentage as Percentage;
    }
    const factor = 10 ** fractionDigits;
    // round half away from zero, like `toFixed`, without the string round-trip
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return ((Math.sign(percentage) * Math.round(Math.abs(percentage) * factor)) / factor) as Percentage;
  };
}
