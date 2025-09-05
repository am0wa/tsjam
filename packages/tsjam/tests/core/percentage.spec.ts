import { Percentage } from 'core/percentage.js';

describe('percentage', () => {
  it('default round', () => {
    expect(Percentage.calculate(5, 100)).toBe(5);
    expect(Percentage.calculate(20, 10)).toBe(200);
    expect(Percentage.calculate(5, 7)).toBe(71.43);
  });
  it('fractionDigits', () => {
    expect(Percentage.calculate(20, 10, 2)).toBe(200);
    expect(Percentage.calculate(5, 7, -1)).toBe(71.42857142857143);
    expect(Percentage.calculate(5, 7, 0)).toBe(71);
    expect(Percentage.calculate(5, 7, 1)).toBe(71.4);
    expect(Percentage.calculate(5, 7, 3)).toBe(71.429);
  });
  it('total is 0', () => {
    expect(() => Percentage.calculate(20, 0)).toThrow();
  });
  it('Factory method', () => {
    expect(Percentage.fromNumber(25)).toBe(25);
    expect(Percentage.fromNumber(-25)).toBe(-25);
    expect(Percentage.fromNumber(0)).toBe(0);
    expect(Percentage.fromNumber(0.5)).toBe(0.5);
  });
  it('Factory method assert', () => {
    expect(() => Percentage.within100(115)).toThrow();
  });
  it('Typeguard', () => {
    expect(Percentage.isIt(115)).toBe(true);
    expect(Percentage.isIt(undefined)).toBe(false);
    expect(Percentage.isIt(null)).toBe(false);
    expect(Percentage.isIt(25)).toBe(true);
    expect(Percentage.isIt(0)).toBe(true);
    expect(Percentage.isIt(-25)).toBe(true);
    expect(Percentage.isIt(25.555)).toBe(true);
  });
});
