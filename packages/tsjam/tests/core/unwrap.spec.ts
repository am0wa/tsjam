import * as unwrap from 'core/unwrap.js';
import { unwrap as unwrapFromBarrel } from 'core/index.js';

describe('Unwrap', () => {
  it('is exported from the barrel as the unwrap group', () => {
    expect(unwrapFromBarrel.expected).toBe(unwrap.expected);
    expect(Object.keys(unwrapFromBarrel).sort()).toEqual(['expected', 'id', 'normalizeUnsupported', 'ownProperty']);
  });
  const testObj = { a: 'A', b: undefined, c: '' };

  it('should return value if exists', () => {
    expect(unwrap.expected(testObj.a, 'All good')).toBe('A');
  });

  it('should throw error if undefined', () => {
    expect(() => unwrap.expected(testObj.b, 'B is expected')).toThrow('assertExists: B is expected');
  });

  it('should return empty value', () => {
    expect(unwrap.expected(testObj.c, 'C is expected')).toBe('');
  });

  it('ownProperty - returns own values only, ignores inherited', () => {
    expect(unwrap.ownProperty(testObj, 'a')).toBe('A');
    const child: { inherited?: number } = {};
    Object.setPrototypeOf(child, { inherited: 1 });
    expect(child.inherited).toBe(1);
    expect(unwrap.ownProperty(child, 'inherited')).toBeUndefined();
  });

  it('should throw error if empty string', () => {
    expect(() => unwrap.id(testObj.c, 'C is expected')).toThrow('assertNonEmptyString: C is expected');
  });
});
