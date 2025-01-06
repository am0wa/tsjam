import { isEmpty, isObject, isSomething, isString } from 'core/is-it';

const getUncertainResult = (): object | undefined | null => {
  return undefined;
};

describe('isString', () => {
  it('should be true with strings', () => {
    expect(isString('SomeString')).toBe(true);
    expect(isString('')).toBe(true);
  });
  it('should be false if its null', () => {
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
  it('should be false with objects and arrays', () => {
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
  });
  it('should work as typeguard', () => {
    const x: unknown = 25;
    // just semantic compile-time check
    if (isString(x)) {
      x.toLowerCase();
    }
  });
});

describe('isObject', () => {
  it('should be true if its object or array', () => {
    expect(isObject({ a1: 'A1' })).toBe(true);
    expect(isObject(['A', 'B'])).toBe(true);
  });
  it('should be false if its null', () => {
    expect(isObject(null)).toBe(false);
  });
  it('should be false with primitives', () => {
    expect(isObject('SomeString')).toBe(false);
    expect(isObject(22)).toBe(false);
    expect(isObject(true)).toBe(false);
  });
});

describe('isSomething', () => {
  it('should be true for existing stuff (even falsy)', () => {
    expect(isSomething(false)).toBe(true);
    expect(isSomething(0)).toBe(true);
    expect(isSomething('')).toBe(true);
    expect(isSomething([])).toBe(true);
    expect(isSomething({})).toBe(true);
  });

  it('should be false for null and undefined', () => {
    expect(isSomething(undefined)).toBe(false);
    expect(isSomething(null)).toBe(false);
  });

  it('should act as typeguard', () => {
    const foo = getUncertainResult();
    if (isSomething(foo)) {
      // foo is narrowed, so we can call methods on it
      foo.toString();
    }
  });
});

describe('isEmpty', () => {
  it('should be true for array like entities with no items', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty('')).toBe(true);
    const rList: readonly number[] = [];
    expect(isEmpty(rList)).toBe(true);
  });

  it('should be true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should be false for array like entities with items)', () => {
    expect(isEmpty('A')).toBe(false);
    expect(isEmpty(['A'])).toBe(false);
    const rList: readonly number[] = [1, 2, 3, 4];
    expect(isEmpty(rList)).toBe(false);
  });

  it('should be false for filled  Map & Set', () => {
    expect(
      isEmpty(
        new Map([
          [1, 'one'],
          [2, 'two'],
        ]),
      ),
    ).toBe(false);
    expect(
      isEmpty(
        new Set([
          [1, 'one'],
          [2, 'two'],
        ]),
      ),
    ).toBe(false);
  });

  it('should be true for empty  Map & Set', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
  });
});
