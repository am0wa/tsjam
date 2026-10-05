import * as root from 'core/index.js';
import { closest } from 'core/math.js';

describe('math', () => {
  it('is exported flat from the root barrel', () => {
    expect(root.closest).toBe(closest);
    expect('math' in root).toBe(false);
  });
  it('closest', () => {
    expect(closest(5, [2, 4, 5])).toBe(5);
    expect(closest(2, [2, 4, 5])).toBe(2);
    expect(closest(3, [2, 4, 5])).toBe(2);
    expect(closest(7, [2, 4, 5])).toBe(5);
    expect(closest(7, [])).toBeNaN();
  });
  it('closest - returns an element of the list, never the seed', () => {
    expect(closest(-1, [5])).toBe(5);
    expect(closest(-10, [-3, 5])).toBe(-3);
    expect(closest(100, [5, 10])).toBe(10);
  });
  it('closest - first one wins on a tie', () => {
    expect(closest(3, [2, 4])).toBe(2);
    expect(closest(3, [4, 2])).toBe(4);
  });
  it('closest - ignores NaN items wherever they are', () => {
    expect(closest(3, [NaN, 3])).toBe(3);
    expect(closest(3, [1, NaN, 4])).toBe(4);
    expect(closest(3, [NaN])).toBeNaN();
    expect(closest(3, [NaN, NaN])).toBeNaN();
  });
});
