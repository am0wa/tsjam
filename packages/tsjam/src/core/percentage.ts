import { assert } from './assert';
import { Opaque } from './types';

/**
 * % 0..100...N number.
 * In math a percentage `(x/y * 100)` is a number or ratio expressed as a fraction of 100.
 */
export type Percentage = Opaque<'Percentage', number>;

export namespace Percentage {
  export const fromNumber = (num: number): Percentage => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return num as Percentage;
  };

  /**
   * Creates Percentage asserting value is within 0..100 range.
   */
  export const within100 = (num: number): Percentage => {
    assert(Math.abs(num) <= 100, `Expected value for Percentage between 0 and 100, got ${num}`);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return num as Percentage;
  };

  export const isIt = (x: unknown): x is Percentage => {
    return typeof x === 'number';
  };

  /**
   * Calculates percentage `(part/total * 100)`
   * @param part
   * @param total
   * @param fractionDigits - digits after decimal place (2 by default).
   * The number is rounded if necessary. If negative - no rounding then.
   */
  export const calculate = (part: number, total: number, fractionDigits = 2): Percentage => {
    assert(total > 0, 'Dividing by 0 is not allowed!');
    const percentage = (part / total) * 100;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return fractionDigits >= 0 ? (+percentage.toFixed(fractionDigits) as Percentage) : (percentage as Percentage);
  };
}
