import { assert } from 'core/assert.js';
import { AssertionError } from 'core/errors.js';

describe('Assert', () => {
  it('true with truthy condition', () => {
    assert(true);
  });
  it('false with falsy condition', () => {
    expect(() => {
      assert(1 > 10);
    }).toThrow();
  });
  it('expression should be invoked by user', () => {
    const obj = { ok: () => true, fail: () => false };
    expect(() => {
      assert(obj.fail());
    }).toThrow();
  });
  it('forgotten expression should be invoked', () => {
    const obj = { ok: () => true, fail: () => false };
    expect(() => {
      assert(obj.fail);
    }).toThrow();
  });
  it('forgotten dev expression should be invoked only in dev', () => {
    const obj = { ok: () => true, fail: () => false };
    assert.dev(obj.fail);
    // should not throw as we test towards prod by default
  });
  describe('dev', () => {
    const original: unknown = Reflect.get(globalThis, '__DEVELOPMENT__');
    afterEach(() => {
      Reflect.set(globalThis, '__DEVELOPMENT__', original);
    });

    it('should not crash when __DEVELOPMENT__ is not defined', () => {
      Reflect.deleteProperty(globalThis, '__DEVELOPMENT__');
      expect(() => assert.dev(false)).not.toThrow();
    });
    it('should assert when __DEVELOPMENT__ is true', () => {
      Reflect.set(globalThis, '__DEVELOPMENT__', true);
      expect(() => assert.dev(false)).toThrow();
      expect(() => assert.dev(() => true)).not.toThrow();
    });
  });
  it('exists - throws only for null / undefined', () => {
    expect(() => assert.exists(null, 'x')).toThrow('assertExists: x');
    expect(() => assert.exists(undefined, 'x')).toThrow('assertExists: x');
    expect(() => assert.exists(0, 'x')).not.toThrow();
    expect(() => assert.exists('', 'x')).not.toThrow();
  });
  it('never - throws AssertionError with the unexpected value, even a Symbol', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(() => assert.never('surprise' as never)).toThrow('assertNever: surprise');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(() => assert.never(Symbol('odd') as never)).toThrow(AssertionError);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(() => assert.never(Symbol('odd') as never)).toThrow('assertNever: Symbol(odd)');
  });
  it('nonEmptyString to throw', () => {
    expect(() => {
      assert.nonEmptyString('', 'Id should be present');
    }).toThrow();
    expect(() => {
      assert.nonEmptyString(null, 'Id is expected');
    }).toThrow();
  });
});
