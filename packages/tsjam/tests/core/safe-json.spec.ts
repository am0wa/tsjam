import * as SafeJSON from 'core/safe-json.js';
import { SafeJSON as SafeJSONFromBarrel } from 'core/index.js';

describe('SafeJSON.stringify', () => {
  it('is exported from the barrel as the SafeJSON group', () => {
    expect(SafeJSONFromBarrel.parse).toBe(SafeJSON.parse);
    expect(Object.keys(SafeJSONFromBarrel).sort()).toEqual(['parse', 'parsePromise', 'stringify']);
  });
  it('matches JSON.stringify for plain data', () => {
    const data = { a: 1, b: 'x', c: [true, null], d: { e: 2 } };
    expect(SafeJSON.stringify(data)).toBe(JSON.stringify(data));
    expect(SafeJSON.stringify(data, null, 2)).toBe(JSON.stringify(data, null, 2));
  });

  it('serializes bigint as a decimal string, at any depth', () => {
    const timestamp = { seconds: 1790947358n, nanos: 106089000 };
    expect(SafeJSON.stringify({ gameDate: timestamp, list: [1n] })).toBe(
      '{"gameDate":{"seconds":"1790947358","nanos":106089000},"list":["1"]}',
    );
    expect(SafeJSON.stringify(9007199254740993n)).toBe('"9007199254740993"');
  });

  it('keeps bigint lossless beyond Number.MAX_SAFE_INTEGER', () => {
    const big = 2n ** 63n - 1n;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    expect(BigInt(JSON.parse(SafeJSON.stringify({ big }) ?? '{}').big)).toBe(big);
  });

  it('applies an allowlist replacer exactly like JSON.stringify', () => {
    const data = { z: 1, a: { z: 2, b: 3, a: 4 }, list: [{ a: 5, x: 6 }], b: 7 };
    const allowlist = ['a', 'z', 'list', 'z'];
    expect(SafeJSON.stringify(data, allowlist)).toBe(JSON.stringify(data, allowlist));
  });

  it('applies an allowlist replacer alongside bigint', () => {
    expect(SafeJSON.stringify({ id: 1n, secret: 'x' }, ['id'])).toBe('{"id":"1"}');
  });

  it('calls a function replacer, then serializes a bigint it returns', () => {
    const replacer = (key: string, value: unknown): unknown => (key === 'n' ? 5n : value);
    expect(SafeJSON.stringify({ n: 1, m: 2 }, replacer)).toBe('{"n":"5","m":2}');
  });

  it('returns undefined on a circular structure', () => {
    const data: Record<string, unknown> = {};
    data.self = data;
    expect(SafeJSON.stringify(data)).toBeUndefined();
  });

  describe('parsePromise', () => {
    it('resolves with parsed JSON', async () => {
      await expect(SafeJSON.parsePromise('{"a":1}')).resolves.toEqual({ a: 1 });
    });

    it('rejects on invalid JSON instead of throwing synchronously', async () => {
      let promise: Promise<unknown> | undefined;
      expect(() => {
        promise = SafeJSON.parsePromise('{not json');
      }).not.toThrow();
      await expect(promise).rejects.toThrow(SyntaxError);
    });
  });
});
