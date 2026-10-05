import * as Collections from 'core/collections.js';
import { Collections as CollectionsFromBarrel } from 'core/index.js';

describe('collections', () => {
  it('is exported from the barrel as the Collections group', () => {
    expect(CollectionsFromBarrel.first).toBe(Collections.first);
    expect(Object.keys(CollectionsFromBarrel)).toContain('equalByContent');
  });
  it('first', () => {
    expect(Collections.first(['A', 'B'])).toBe('A');
    expect(Collections.first([])).toBe(undefined);
    expect(Collections.first(undefined)).toBe(undefined);
  });
  it('last', () => {
    expect(Collections.last(['A', 'B'])).toBe('B');
    expect(Collections.last([])).toBe(undefined);
    expect(Collections.last(undefined)).toBe(undefined);
  });
  it('removeFirst', () => {
    expect(Collections.removeFirst(['A', 'B'])).toEqual(['B']);
    expect(Collections.removeFirst(['A', 'B'])).toEqual(['B']);
    expect(Collections.removeFirst([])).toEqual([]);
  });
  it('removeLast', () => {
    expect(Collections.removeLast(['A', 'B'])).toEqual(['A']);
    expect(Collections.removeLast(['A', 'B'])).toEqual(['A']);
    expect(Collections.removeLast([])).toEqual([]);
  });
  it('random', () => {
    expect(['A', 'B']).toContain(Collections.random(['A', 'B']));
    expect(Collections.random(['A', 'B'], 'C')).toBeDefined();
  });
  it('distinct', () => {
    expect(Collections.distinct(['A', 'B', 'B', 'A', 'C'])).toEqual(['A', 'B', 'C']);
    expect(Collections.distinct([])).toEqual([]);
  });
  it('removeLast N', () => {
    expect(Collections.removeLast(['A', 'B', 'C'], 2)).toEqual(['A']);
    expect(Collections.removeLast(['A', 'B', 'C'], 3)).toEqual([]);
    expect(Collections.removeLast(['A', 'B', 'C'], 7)).toEqual([]);
  });
  it('removeLast N <= 0 removes nothing, returns a copy', () => {
    const list = ['A', 'B', 'C'];
    expect(Collections.removeLast(list, 0)).toEqual(['A', 'B', 'C']);
    expect(Collections.removeLast(list, -2)).toEqual(['A', 'B', 'C']);
    expect(Collections.removeLast(list, 0)).not.toBe(list);
  });
  describe('removeSlice', () => {
    it('remove Middle part', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 1, end: 3 })).toEqual(['A', 'D']);
    });
    it('remove Till the End', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 1 })).toEqual(['A']);
    });
    it('remove with negative Start', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: -2 })).toEqual(['A', 'B']);
    });
    it('remove with negative Start and End', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: -2, end: -1 })).toEqual(['A', 'B', 'D']);
    });
    it('remove with negative End', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 2, end: -1 })).toEqual(['A', 'B', 'D']);
    });
    it('inverted or empty slice removes nothing', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 3, end: 1 })).toEqual(['A', 'B', 'C', 'D']);
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 2, end: 2 })).toEqual(['A', 'B', 'C', 'D']);
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: -1, end: -3 })).toEqual(['A', 'B', 'C', 'D']);
    });
    it('out of range bounds are clamped', () => {
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: -9, end: 2 })).toEqual(['C', 'D']);
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 1, end: 9 })).toEqual(['A']);
      expect(Collections.removeSlice(['A', 'B', 'C', 'D'], { start: 9 })).toEqual(['A', 'B', 'C', 'D']);
    });
    it('returns a copy', () => {
      const list = ['A', 'B'];
      expect(Collections.removeSlice(list, { start: 2 })).not.toBe(list);
    });
  });
  describe('areEqual', () => {
    it('not equal by length to return false', () => {
      expect(Collections.areEqual(['A'], ['A', 'A'])).toBe(false);
    });
    it('equal by elements', () => {
      expect(Collections.areEqual(['A', 'B'], ['A', 'B'])).toBe(true);
      expect(Collections.areEqual(['A', 'B'], ['A', 'D'])).toBe(false);
    });
    it('empty equals', () => {
      expect(Collections.areEqual(['A', 'B'], undefined)).toBe(false);
      expect(Collections.areEqual(undefined, ['A', 'D'])).toBe(false);
    });
    it('compares objects by reference by default', () => {
      const obj = { a: 'B' };
      expect(Collections.areEqual(['A', obj], ['A', obj])).toBe(true);
      expect(Collections.areEqual(['A', { a: 'B' }], ['A', { a: 'B' }])).toBe(false);
    });
    it('NaN equals NaN by default', () => {
      expect(Collections.areEqual([NaN, 1], [NaN, 1])).toBe(true);
    });
    it('stops at the first mismatch', () => {
      let calls = 0;
      const eq = (a: number, b: number): boolean => {
        calls++;
        return a === b;
      };
      expect(Collections.areEqual([1, 2, 3, 4], [9, 2, 3, 4], eq)).toBe(false);
      expect(calls).toBe(1);
    });
    it('equal by equalityTest', () => {
      expect(Collections.areEqual([{ a: 'A' }, { a: 'B' }], [{ a: 'A' }, { a: 'B' }], (a, b) => a.a === b.a)).toBe(
        true,
      );
    });
    it('equal by equalityTest of order', () => {
      expect(Collections.areEqual([{ a: 'A' }, { a: 'B' }], [{ a: 'B' }, { a: 'A' }], (a, b) => a.a === b.a)).toBe(
        false,
      );
    });
  });
  describe('areEqualByContent', () => {
    it('not equal by length to return false', () => {
      expect(Collections.equalByContent(['A'], ['A', 'A'])).toBe(false);
    });
    it('equal by elements', () => {
      expect(Collections.equalByContent(['A', 'B'], ['A', 'B'])).toBe(true);
      expect(Collections.equalByContent(['A', 'B'], ['A', 'D'])).toBe(false);
    });
    it('empty equals', () => {
      expect(Collections.equalByContent(['A', 'B'], undefined)).toBe(false);
      expect(Collections.equalByContent(undefined, ['A', 'D'])).toBe(false);
    });
    it('equal by ref', () => {
      const listA = ['A', { a: 'B' }];
      const listB = ['A', { a: 'D' }];
      expect(Collections.equalByContent(listA, listA)).toBe(true);
      expect(Collections.equalByContent(listA, listB)).toBe(false);
    });
    it('equal by keyOf', () => {
      expect(Collections.equalByContent([{ a: 'A' }, { a: 'B' }], [{ a: 'A' }, { a: 'B' }], (x) => x.a)).toBe(true);
    });
    it('equal by keyOf regardless of order', () => {
      expect(Collections.equalByContent([{ a: 'A' }, { a: 'B' }], [{ a: 'B' }, { a: 'A' }], (x) => x.a)).toBe(true);
    });
    it('A contains B', () => {
      expect(Collections.equalByContent(['A', 'B'], ['A', 'B'])).toBe(true);
      expect(Collections.equalByContent(['B', 'A'], ['A', 'B'])).toBe(true);

      expect(Collections.equalByContent(['A', 'B'], ['B'])).toBe(false);
      expect(Collections.equalByContent(['B'], ['A', 'B'])).toBe(false);
      expect(Collections.equalByContent(['B', 'B'], ['A', 'B'])).toBe(false);
      expect(Collections.equalByContent(['B', 'A', 'A'], ['A', 'B'])).toBe(false);
    });
    it('duplicates count', () => {
      expect(Collections.equalByContent(['A', 'A', 'B'], ['A', 'B', 'B'])).toBe(false);
      expect(Collections.equalByContent(['A', 'B', 'B'], ['A', 'A', 'B'])).toBe(false);
      expect(Collections.equalByContent(['A', 'B', 'A'], ['A', 'A', 'B'])).toBe(true);
    });
    it('NaN equals NaN by default', () => {
      expect(Collections.equalByContent([NaN, 1], [1, NaN])).toBe(true);
    });
    it('duplicates count with keyOf', () => {
      const keyOfA = (x: { a: string }): string => x.a;
      expect(Collections.equalByContent([{ a: 'A' }, { a: 'A' }], [{ a: 'A' }, { a: 'B' }], keyOfA)).toBe(false);
      expect(Collections.equalByContent([{ a: 'A' }, { a: 'B' }], [{ a: 'B' }, { a: 'A' }], keyOfA)).toBe(true);
    });
  });
  describe('invertMap', () => {
    it('Map B has inverted key values of map A', () => {
      const mapA = new Map([
        ['keyA', 'A'],
        ['keyB', 'B'],
      ]);
      const mapB = Collections.invertMap(mapA);
      expect(mapB.get('A')).toBe('keyA');
      expect(mapB.get('B')).toBe('keyB');
    });
  });
});
