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

  /**
   * JSON.stringify as its. Silently Returns undefined in case of serialisation err
   */
  export const stringify = (
    data: unknown,
    replacer?: (number | string)[] | null,
    space?: string | number,
  ): string | undefined => {
    try {
      return JSON.stringify(data, replacer, space);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return undefined;
    }
  };
}
