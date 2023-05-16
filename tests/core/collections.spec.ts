import { Collections } from 'core/collections';

describe('collections', () => {
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
  it('distinct', () => {
    expect(Collections.distinct(['A', 'B', 'B', 'A', 'C'])).toEqual(['A', 'B', 'C']);
    expect(Collections.distinct([])).toEqual([]);
  });
  it('removeLast N', () => {
    expect(Collections.removeLast(['A', 'B', 'C'], 2)).toEqual(['A']);
    expect(Collections.removeLast(['A', 'B', 'C'], 3)).toEqual([]);
    expect(Collections.removeLast(['A', 'B', 'C'], 7)).toEqual([]);
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
    it('equal by objects', () => {
      expect(Collections.areEqual(['A', { a: 'B' }], ['A', { a: 'B' }])).toBe(true);
      expect(Collections.areEqual(['A', { a: 'B' }], ['A', { a: 'D' }])).toBe(false);
    });
    it('equal by equalityTest', () => {
      expect(Collections.areEqual(
        [{ a: 'A' }, { a: 'B' }],
        [{ a: 'A' }, { a: 'B' }],
        (a, b) => a.a === b.a
        )
      ).toBe(true);
    });
    it('equal by equalityTest of order', () => {
      expect(Collections.areEqual(
          [{ a: 'A' }, { a: 'B' }],
          [{ a: 'B' }, { a: 'A' }],
          (a, b) => a.a === b.a
        )
      ).toBe(false);
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
    it('equal by equalityTest', () => {
      expect(Collections.equalByContent(
          [{ a: 'A' }, { a: 'B' }],
          [{ a: 'A' }, { a: 'B' }],
          (a, b) => a.a === b.a
        )
      ).toBe(true);
    });
    it('equal by equalityTest regardless of order', () => {
      expect(Collections.equalByContent(
          [{ a: 'A' }, { a: 'B' }],
          [{ a: 'B' }, { a: 'A' }],
          (a, b) => a.a === b.a
        )
      ).toBe(true);
    });
    it('A contains B', () => {
      expect(Collections.equalByContent(['A', 'B'], ['A', 'B'])).toBe(true);
      expect(Collections.equalByContent(['B', 'A'], ['A', 'B'])).toBe(true);

      expect(Collections.equalByContent(['A', 'B'], ['B'])).toBe(false);
      expect(Collections.equalByContent(['B'],['A', 'B'] )).toBe(false);
      expect(Collections.equalByContent(['B', 'B'],['A', 'B'] )).toBe(false);
      expect(Collections.equalByContent(['B', 'A', 'A'], ['A', 'B'])).toBe(false);
    });
  });
})