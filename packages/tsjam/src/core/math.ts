export namespace math {
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
}
