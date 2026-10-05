import * as root from 'core/index.js';
import { clamp, closest, floorTo, roundTo } from 'core/math.js';

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

  it('clamp - keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(-Infinity, -1, 1)).toBe(-1);
    expect(clamp(7, 3, 3)).toBe(3);
  });
  it('clamp - NaN value stays NaN', () => {
    expect(clamp(NaN, 0, 10)).toBeNaN();
  });
  it('clamp - throws RangeError on invalid bounds', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
    expect(() => clamp(5, NaN, 10)).toThrow(RangeError);
    expect(() => clamp(5, 0, NaN)).toThrow(RangeError);
  });

  describe('roundTo', () => {
    it('rounds to decimal places, default 0', () => {
      expect(roundTo(123.456, 2)).toBe(123.46);
      expect(roundTo(123.454, 2)).toBe(123.45);
      expect(roundTo(123.456)).toBe(123);
      expect(roundTo(8.345, 2)).toBe(8.35);
    });

    it('exact halves go away from zero', () => {
      expect([0.5, 1.5, 2.5, -0.5, -1.5, -2.5].map((v) => roundTo(v))).toEqual([1, 2, 3, -1, -2, -3]);
      expect(roundTo(0.125, 2)).toBe(0.13); // exactly representable tie
      expect(roundTo(-0.375, 2)).toBe(-0.38);
    });

    it('rounds the exact binary value, like toFixed (web-client Money.roundMoney contract)', () => {
      expect(roundTo(1.005, 2)).toBe(1); // 1.005 is stored as 1.00499999999999989…
      expect(roundTo(1.015 * 100, 0)).toBe(101); // 101.49999999999999
      expect(roundTo(2.3 * 100, 0)).toBe(230); // 229.99999999999997
      expect(roundTo(0.1 + 0.2, 10)).toBe(0.3);
    });

    it('decides near-ties exactly where value * 10^d is itself rounded', () => {
      expect(roundTo(-25023958.4594965, 6)).toBe(+(-25023958.4594965).toFixed(6));
    });

    it('negative digits round to tens, hundreds', () => {
      expect(roundTo(1234.5, -2)).toBe(1200);
      expect(roundTo(1250, -2)).toBe(1300);
      expect(roundTo(-1250, -2)).toBe(-1300);
      expect(roundTo(49, -2)).toBe(0);
    });

    it('fractional digits are truncated, like toFixed', () => {
      expect(roundTo(1.2345, 2.9)).toBe(1.23);
    });

    it('keeps the sign of zero, like +toFixed', () => {
      expect(roundTo(-0.001, 2)).toBe(-0);
      expect(roundTo(0, 2)).toBe(0);
      expect(roundTo(-0, 2)).toBe(-0);
    });

    it('tiny values round to zero, more digits than representable keep the value', () => {
      expect(roundTo(1e-10, 2)).toBe(0);
      expect(roundTo(Number.MIN_VALUE, 2)).toBe(0);
      expect(roundTo(0.1, 20)).toBe(0.1);
    });

    it('NaN, Infinity and values without fraction digits left are returned as is', () => {
      expect(roundTo(NaN, 2)).toBeNaN();
      expect(roundTo(Infinity, 2)).toBe(Infinity);
      expect(roundTo(-Infinity, 2)).toBe(-Infinity);
      expect(roundTo(Number.MAX_VALUE, 2)).toBe(Number.MAX_VALUE);
      expect(roundTo(1e21, 2)).toBe(1e21);
      expect(roundTo(2 ** 60, 0)).toBe(2 ** 60);
      expect(roundTo(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('matches +toFixed on 50k pseudo-random values across magnitudes and digits', () => {
      let seed = 42;
      const next = (): number => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
      for (let i = 0; i < 50_000; i++) {
        const value = (next() - 0.5) * 10 ** (Math.floor(next() * 24) - 8);
        const digits = Math.floor(next() * 16);
        expect(roundTo(value, digits)).toBe(+value.toFixed(digits));
      }
    });
  });

  describe('floorTo', () => {
    it('floors to decimal places, default 0', () => {
      expect(floorTo(123.456, 2)).toBe(123.45);
      expect(floorTo(123.459, 2)).toBe(123.45);
      expect(floorTo(123.9)).toBe(123);
    });

    it('ignores float noise from scaling – exact decimals stay as they are', () => {
      expect(2.3 * 100).toBe(229.99999999999997);
      expect(floorTo(2.3, 2)).toBe(2.3); // naive Math.floor(2.3 * 100) / 100 is 2.29
      expect(floorTo(4.35, 2)).toBe(4.35); // 4.35 * 100 is 434.99999999999994
      expect(floorTo(1.005, 2)).toBe(1); // 1.00499… is genuinely below 1.005
    });

    it('keeps the web-client Money.floorCents contract', () => {
      expect([37.9, 17.5, 0.555555].map((v) => floorTo(v))).toEqual([37, 17, 0]);
      expect(floorTo(3419.999999999991)).toBe(3419);
      expect(floorTo(3419.999999999994)).toBe(3419);
      expect(floorTo(3419.9999999999995)).toBe(3420);
    });

    it('large values keep their real digits (toPrecision(15) would round them up)', () => {
      expect(floorTo(1234567890123.456, 2)).toBe(1234567890123.45);
    });

    it('floors toward -Infinity for negative values', () => {
      expect(floorTo(-2.31, 1)).toBe(-2.4);
      expect(floorTo(-2.3, 1)).toBe(-2.3);
      expect(floorTo(-0.001, 2)).toBe(-0.01);
    });

    it('negative digits floor to tens, hundreds', () => {
      expect(floorTo(1250, -2)).toBe(1200);
      expect(floorTo(1999, -3)).toBe(1000);
      expect(floorTo(3, -2)).toBe(0);
    });

    it('NaN, Infinity and values without fraction digits left are returned as is', () => {
      expect(floorTo(NaN, 2)).toBeNaN();
      expect(floorTo(Infinity, 2)).toBe(Infinity);
      expect(floorTo(-Infinity, 2)).toBe(-Infinity);
      expect(floorTo(1e21, 2)).toBe(1e21);
    });

    it('exact decimals n / 10^d never lose a unit, values between steps floor down', () => {
      for (let digits = 0; digits <= 6; digits++) {
        for (let n = -50_000; n <= 50_000; n += 13) {
          const decimal = n / 10 ** digits;
          expect(floorTo(decimal, digits)).toBe(decimal);
          expect(floorTo((n + 0.5) / 10 ** digits, digits)).toBe(decimal);
        }
      }
    });
  });
});
