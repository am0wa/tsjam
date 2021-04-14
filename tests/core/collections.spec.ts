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
})