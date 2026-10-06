import {
  type Comparable,
  compareComparables,
  type Comparator,
  comparePrimitives,
  compareStrings,
  ComparisonResult,
} from 'core/comparison.js';

describe('comparison', () => {
  describe('ComparisonResult', () => {
    it('is a plain value object, no enum reverse mapping', () => {
      expect(ComparisonResult).toEqual({ Lower: -1, Same: 0, Higher: 1 });
      expect(Object.keys(ComparisonResult)).toEqual(['Lower', 'Same', 'Higher']);
    });
  });

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

  describe('compareStrings util', () => {
    it('ignores case by default', () => {
      expect(compareStrings('Apple', 'apple')).toBe(ComparisonResult.Same);
      expect(compareStrings('apple', 'Banana')).toBe(ComparisonResult.Lower);
      expect(compareStrings('Banana', 'apple')).toBe(ComparisonResult.Higher);
    });

    it('is case sensitive on demand', () => {
      expect(compareStrings('Apple', 'apple', false)).toBe(ComparisonResult.Lower);
      expect(compareStrings('apple', 'Apple', false)).toBe(ComparisonResult.Higher);
      expect(compareStrings('apple', 'apple', false)).toBe(ComparisonResult.Same);
    });
  });

  describe('Comparator', () => {
    it('accepts any sort-compatible comparator', () => {
      const byValue: Comparator<number> = (a, b) => a - b;
      const collator: Comparator<string> = new Intl.Collator('en').compare;
      expect([3, 1, 2].sort(byValue)).toEqual([1, 2, 3]);
      expect(['b', 'a'].sort(collator)).toEqual(['a', 'b']);
    });
  });

  describe('Comparable', () => {
    class Money implements Comparable<Money> {
      readonly cents: number;
      constructor(cents: number) {
        this.cents = cents;
      }
      compare(other: Money): number {
        return this.cents - other.cents;
      }
    }

    it('compare - delegates to the item, usable as a sort comparator', () => {
      const [low, high] = [new Money(100), new Money(250)];
      expect(compareComparables(low, high)).toBeLessThan(0);
      expect(compareComparables(high, low)).toBeGreaterThan(0);
      expect(compareComparables(low, new Money(100))).toBe(0);
      expect([high, low].sort(compareComparables)).toEqual([low, high]);
    });
  });
});
