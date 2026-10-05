import * as root from 'core/index.js';
import { assertWithin100, calculatePercentage, isPercentage, toPercentage } from 'core/percentage.js';

describe('percentage', () => {
  it('helpers are flat root exports, Percentage is a type only', () => {
    expect(root.toPercentage).toBe(toPercentage);
    expect('Percentage' in root).toBe(false);
  });
  it('default round', () => {
    expect(calculatePercentage(5, 100)).toBe(5);
    expect(calculatePercentage(20, 10)).toBe(200);
    expect(calculatePercentage(5, 7)).toBe(71.43);
  });
  it('fractionDigits', () => {
    expect(calculatePercentage(20, 10, 2)).toBe(200);
    expect(calculatePercentage(5, 7, -1)).toBe(71.42857142857143);
    expect(calculatePercentage(5, 7, 0)).toBe(71);
    expect(calculatePercentage(5, 7, 1)).toBe(71.4);
    expect(calculatePercentage(5, 7, 3)).toBe(71.429);
  });
  it('total is 0', () => {
    expect(() => calculatePercentage(20, 0)).toThrow();
  });
  it('Factory method', () => {
    expect(toPercentage(25)).toBe(25);
    expect(toPercentage(-25)).toBe(-25);
    expect(toPercentage(0)).toBe(0);
    expect(toPercentage(0.5)).toBe(0.5);
  });
  it('Factory method assert', () => {
    expect(() => assertWithin100(115)).toThrow();
    expect(assertWithin100(42)).toBe(42);
  });
  it('Typeguard', () => {
    expect(isPercentage(115)).toBe(true);
    expect(isPercentage(undefined)).toBe(false);
    expect(isPercentage(null)).toBe(false);
    expect(isPercentage(25)).toBe(true);
    expect(isPercentage(0)).toBe(true);
    expect(isPercentage(-25)).toBe(true);
    expect(isPercentage(25.555)).toBe(true);
    expect(isPercentage(NaN)).toBe(false);
    expect(isPercentage(Infinity)).toBe(false);
    expect(isPercentage('25')).toBe(false);
  });
});
