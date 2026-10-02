export namespace math {
  /**
   * Returns the element of `among` closest to `goal` (the first one on a tie).
   * Returns `NaN` for an empty list – there is no closest element.
   */
  export const closest = (goal: number, among: readonly number[]): number => {
    if (among.length === 0) {
      return NaN;
    }
    return among.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));
  };
}
