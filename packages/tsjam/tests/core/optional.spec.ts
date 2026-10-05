import { optionalMap } from 'core/optional.js';

describe('optionalMap', () => {
  const double = (n: number): number => n * 2;

  it('maps a present value', () => {
    expect(optionalMap(2, double)).toBe(4);
  });

  it('returns undefined for null / undefined without calling the mapper', () => {
    let calls = 0;
    const mapper = (n: number): number => {
      calls++;
      return double(n);
    };
    expect(optionalMap<number, number>(null, mapper)).toBeUndefined();
    expect(optionalMap<number, number>(undefined, mapper)).toBeUndefined();
    expect(calls).toBe(0);
  });

  it('returns the default for a missing value', () => {
    const result: number = optionalMap<number, number>(null, double, -1);
    expect(result).toBe(-1);
  });

  it('maps falsy but present values', () => {
    expect(optionalMap(0, double, -1)).toBe(0);
    expect(optionalMap('', (s) => s.length)).toBe(0);
    expect(optionalMap(false, (b) => !b)).toBe(true);
  });

  it('the default does not replace what the mapper returns', () => {
    expect(optionalMap(1, () => undefined, 'default')).toBeUndefined();
  });
});
