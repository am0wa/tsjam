import { Equatable, isEquatable } from 'core/equatable.js';

describe('Equatable', () => {
  it('false with primitives', () => {
    expect(isEquatable(5)).toBe(false);
  });

  it('true with objects that have equals()', () => {
    expect(isEquatable({ equals: () => false })).toBe(true);
  });

  describe('areEqualByRef', () => {
    it('false on objects with different refs', () => {
      const a = { foo: () => false };
      const b = { foo: () => false };
      expect(Equatable.areEqualByRef(a, b)).toBe(false);
    });
    it('true on objects with same refs', () => {
      const a = { foo: () => false };
      const b = a;
      expect(Equatable.areEqualByRef(a, b)).toBe(true);
    });
  });

  describe('areEqual', () => {
    it('checks objects by equals, not refs', () => {
      const a = { equals: (x: unknown) => !!x };
      const b = { equals: (x: unknown) => !!x };
      expect(Equatable.areEqual(a, b)).toBe(true);
    });
  });
});
