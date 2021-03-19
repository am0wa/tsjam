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
})