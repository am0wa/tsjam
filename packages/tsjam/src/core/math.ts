/**
 * Returns the element of `among` closest to `goal` (the first one on a tie); `NaN` items are ignored.
 * Returns `NaN` when there is no candidate (empty list or only `NaN`).
 * Complexity: O(n) time, O(1) space.
 */
export const closest = (goal: number, among: readonly number[]): number => {
  let best = NaN;
  let bestDiff = Infinity;
  for (const value of among) {
    const diff = Math.abs(value - goal);
    if (diff < bestDiff) {
      best = value;
      bestDiff = diff;
    }
  }
  return best;
};

/**
 * Limits `value` to the `[min, max]` range; `NaN` stays `NaN`.
 * Throws `RangeError` for invalid bounds (`min > max` or a `NaN` bound) – same contract as the TC39 `Math.clamp` proposal.
 * Complexity: O(1).
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (!(min <= max)) {
    throw new RangeError(`clamp: min (${min}) must not be greater than max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
};

/**
 * Rounds to `fractionDigits` decimals, halves away from zero – same result as `+value.toFixed(fractionDigits)`, faster.
 * - exact halves: `2.5 → 3`, `-2.5 → -3`
 * - rounds the stored binary value: `1.005` is `1.00499…`, so `roundTo(1.005, 2) → 1`
 * - negative digits round to tens, hundreds: `roundTo(1250, -2) → 1300`
 * - `NaN`, `±Infinity` and values with no fraction left are returned as is
 */
export const roundTo = (value: number, fractionDigits = 0): number => {
  const digits = Math.trunc(fractionDigits);
  const factor = 10 ** digits;
  const scaled = Math.abs(value) * factor;
  if (!(scaled < Number.MAX_SAFE_INTEGER)) {
    return value; // NaN, ±Infinity or nothing left to round
  }
  // near a .5 tie the scaled product's own rounding error decides – defer to the exact toFixed
  if (digits >= 0 && digits <= 100 && Math.abs(scaled - Math.floor(scaled) - 0.5) <= scaled * Number.EPSILON) {
    return +value.toFixed(digits);
  }
  return (Math.sign(value) * Math.round(scaled)) / factor;
};

/** Relative tolerance for float noise from scaling a decimal, e.g. `4.35 * 100 = 434.99999999999994`. */
const scalingNoise = 4 * Number.EPSILON;

/**
 * Floors to `fractionDigits` decimals (toward -∞), ignoring float noise from scaling.
 * - `floorTo(2.3, 2) → 2.3` (naive `Math.floor(2.3 * 100) / 100` gives `2.29`)
 * - `floorTo(-2.31, 1) → -2.4`, `floorTo(1999, -3) → 1000`
 * - `NaN`, `±Infinity` and values with no fraction left are returned as is
 */
export const floorTo = (value: number, fractionDigits = 0): number => {
  const digits = Math.trunc(fractionDigits);
  const scaled = value * 10 ** digits;
  if (!(Math.abs(scaled) < Number.MAX_SAFE_INTEGER)) {
    return value; // NaN, ±Infinity or nothing left to floor
  }
  const nearest = Math.round(scaled);
  const whole = Math.abs(scaled - nearest) <= Math.abs(scaled) * scalingNoise ? nearest : Math.floor(scaled);
  return digits < 0 ? whole * 10 ** -digits : whole / 10 ** digits;
};
