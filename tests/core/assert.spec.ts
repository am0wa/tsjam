import { assert } from 'core/assert';

describe('Assert',() => {

  it('true with truthy condition', () => {
    assert(true);
  });
  it('false with falsy condition', () => {
    expect(() => { assert(1 > 10); }).toThrow();
  });
  it('expression should be invoked by user', () => {
    const obj = { ok: () => true, fail: () => false };
    expect(() => { assert(obj.fail()) }).toThrow();
  });
  it('forgotten expression should be invoked', () => {
    const obj = { ok: () => true, fail: () => false };
    expect(() => {assert(obj.fail) }).toThrow();
  });
  it('forgotten dev expression should be invoked only in dev', () => {
    const obj = { ok: () => true, fail: () => false };
    assert.dev(obj.fail);
    // should not throw as we test towards prod by default
  });
})
