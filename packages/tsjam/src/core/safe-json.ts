import type { Json } from './types.js';

/**
 * Basic JSON parse & stringify
 * Prevents unexpected crashes due to parse/stringify errors of not serializable structures
 */
export namespace SafeJSON {
  export const parse = (data: string, logCb?: (err: unknown) => void): Json | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return JSON.parse(data) as Json;
    } catch (err) {
      logCb?.call(null, err);
      return undefined;
    }
  };

  /**
   * JSON.parse wrapped in Promise
   * Handy if u need to handle error or chain and type guard result
   */
  export const parsePromise = (data: string): Promise<Json> => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Promise.resolve(JSON.parse(data) as Json);
  };

  export type Replacer = ((this: unknown, key: string, value: unknown) => unknown) | (number | string)[] | null;

  /**
   * JSON.stringify as its, plus `bigint` support: serialized as a decimal string (`123n` → `"123"`),
   * the canonical JSON form of int64 — lossless on parse, unlike a number literal.
   * Silently Returns undefined in case of serialisation err (e.g. circular structure)
   */
  export const stringify = (data: unknown, replacer?: Replacer, space?: string | number): string | undefined => {
    try {
      return JSON.stringify(data, bigintSafe(replacer), space);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return undefined;
    }
  };

  /**
   * Native JSON.stringify throws on `bigint` and takes either a function or an allowlist, never both —
   * so the allowlist is re-applied by hand, keeping its native semantics: own keys of every non-array
   * object (root included), in allowlist order.
   */
  const bigintSafe = (replacer: Replacer | undefined) => {
    const allowlist = Array.isArray(replacer) ? [...new Set(replacer.map(String))] : undefined;

    return function (this: unknown, key: string, value: unknown): unknown {
      const replaced = typeof replacer === 'function' ? replacer.call(this, key, value) : value;

      if (typeof replaced === 'bigint') {
        return replaced.toString();
      }

      if (allowlist && isPlainRecord(replaced)) {
        return Object.fromEntries(allowlist.filter((k) => Object.hasOwn(replaced, k)).map((k) => [k, replaced[k]]));
      }

      return replaced;
    };
  };

  const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
}
