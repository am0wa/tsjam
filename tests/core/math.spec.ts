import { math } from 'core';

describe('math',() => {
  it('closest', () => {
    expect(math.closest(5, [2, 4, 5])).toBe(5);
    expect(math.closest(2, [2, 4, 5])).toBe(2);
    expect(math.closest(3, [2, 4, 5])).toBe(2);
    expect(math.closest(7, [2, 4, 5])).toBe(5);
    expect(math.closest(7, [])).toBe(0);
  });
})