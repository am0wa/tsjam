import { math } from 'core/math.js';

describe('math', () => {
  it('closest', () => {
    expect(math.closest(5, [2, 4, 5])).toBe(5);
    expect(math.closest(2, [2, 4, 5])).toBe(2);
    expect(math.closest(3, [2, 4, 5])).toBe(2);
    expect(math.closest(7, [2, 4, 5])).toBe(5);
    expect(math.closest(7, [])).toBeNaN();
  });
  it('closest - returns an element of the list, never the seed', () => {
    expect(math.closest(-1, [5])).toBe(5);
    expect(math.closest(-10, [-3, 5])).toBe(-3);
    expect(math.closest(100, [5, 10])).toBe(10);
  });
  it('closest - first one wins on a tie', () => {
    expect(math.closest(3, [2, 4])).toBe(2);
    expect(math.closest(3, [4, 2])).toBe(4);
  });
  it('closest - ignores NaN items wherever they are', () => {
    expect(math.closest(3, [NaN, 3])).toBe(3);
    expect(math.closest(3, [1, NaN, 4])).toBe(4);
    expect(math.closest(3, [NaN])).toBeNaN();
    expect(math.closest(3, [NaN, NaN])).toBeNaN();
  });
});
