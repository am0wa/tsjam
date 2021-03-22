import { comparePrimitives, ComparisonResult } from 'core/comparison';

describe('comparison', () => {
  describe('comparePrimitives util', () => {
    it('compares numbers', () => {
      expect(comparePrimitives(0, 1)).toBe(ComparisonResult.Lower);
      expect(comparePrimitives(1, 0)).toBe(ComparisonResult.Higher);
      expect(comparePrimitives(0, 0)).toBe(ComparisonResult.Same);
    });

    it('compares strings', () => {
      expect(comparePrimitives('a', 'b')).toBe(ComparisonResult.Lower);
      expect(comparePrimitives('b', 'a')).toBe(ComparisonResult.Higher);
      expect(comparePrimitives('a', 'a')).toBe(ComparisonResult.Same);
    });
  });
});
