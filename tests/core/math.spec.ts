import { math, Percentage } from 'core';

describe('math',() => {
  it('closest', () => {
    expect(math.closest(5, [2, 4, 5])).toBe(5);
    expect(math.closest(2, [2, 4, 5])).toBe(2);
    expect(math.closest(3, [2, 4, 5])).toBe(2);
    expect(math.closest(7, [2, 4, 5])).toBe(5);
    expect(math.closest(7, [])).toBe(0);
  });

  describe('percentage', () => {
    it('default round', () => {
      expect(math.percentage(5, 100)).toBe(5);
      expect(math.percentage(20, 10)).toBe(200);
      expect(math.percentage(5, 7)).toBe(71.43);
    });
    it('fractionDigits', () => {
      expect(math.percentage(20, 10, 2)).toBe(200);
      expect(math.percentage(5, 7, -1)).toBe(71.42857142857143);
      expect(math.percentage(5, 7, 0)).toBe(71);
      expect(math.percentage(5, 7, 1)).toBe(71.4);
      expect(math.percentage(5, 7, 3)).toBe(71.429);
    });
    it('total is 0', () => {
      expect(() => math.percentage(20, 0)).toThrow();
    });
    it('Factory method', () => {
      expect(Percentage.fromNumber(25)).toBe(25);
      expect(Percentage.fromNumber(-25)).toBe(-25);
      expect(Percentage.fromNumber(0)).toBe(0);
      expect(Percentage.fromNumber(0.5)).toBe(0.5);
    });
    it('Factory method assert', () => {
      expect(() => Percentage.fromNumber(115)).toThrow();
    });
    it('Typeguard', () => {
      expect(Percentage.isIt(115)).toBe(false);
      expect(Percentage.isIt(undefined)).toBe(false);
      expect(Percentage.isIt(null)).toBe(false);
      expect(Percentage.isIt(25)).toBe(true);
      expect(Percentage.isIt(0)).toBe(true);
      expect(Percentage.isIt(-25)).toBe(true);
      expect(Percentage.isIt(25.555)).toBe(true);
    });
  });
})