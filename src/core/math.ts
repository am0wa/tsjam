import { assert } from './assert';
import { Opaque } from './types';

/**
 * 0..100 number.
 * In math a percentage `(x/y * 100)` is a number or ratio expressed as a fraction of 100.
 */
export type Percentage = Opaque<'Percentage', number>;

export namespace Percentage {
  export const fromNumber = (num: number): Percentage => {
    assert(Math.abs(num) <= 100, `Expected value for Percentage between 0 and 100, got ${num}`);
    return num as Percentage;
  }

  export const isIt = (x: unknown): x is Percentage => {
    return typeof x === 'number' && Math.abs(x) <= 100;
  }
}

export namespace math {
  export const closest = (goal: number, among: readonly number[]): number => {
    return among.reduce(
      (prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev),
      0,
    );
  }

  /**
   * Calculates percentage `(part/total * 100)`
   * @param part
   * @param total
   * @param fractionDigits - digits after decimal place (2 by default).
   * The number is rounded if necessary. If negative - no rounding then.
   */
  export const percentage = (
    part: number,
    total: number,
    fractionDigits = 2
  ): Percentage => {
    assert(total > 0, 'Dividing by 0 is not allowed!')
    const percentage = part / total * 100;
    return fractionDigits >= 0
      ? +percentage.toFixed(fractionDigits) as Percentage
      : percentage as Percentage
  }
}