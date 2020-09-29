import { comparePrimitives, ComparisonResult } from 'core/comparison';

describe('comparison', () => {
  describe('comparePrimitives util', () => {
    it('compares numbers', () => {
      expect(comparePrimitives(0, 1)).toBe(ComparisonResult.Ascending);
      expect(comparePrimitives(1, 0)).toBe(ComparisonResult.Descending);
      expect(comparePrimitives(0, 0)).toBe(ComparisonResult.Same);
    });

    it('compares strings', () => {
      expect(comparePrimitives('a', 'b')).toBe(ComparisonResult.Ascending);
      expect(comparePrimitives('b', 'a')).toBe(ComparisonResult.Descending);
      expect(comparePrimitives('a', 'a')).toBe(ComparisonResult.Same);
    });
  });
});
