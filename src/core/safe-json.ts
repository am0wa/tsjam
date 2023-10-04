import { Json } from './types';

/**
 * Basic JSON parse & stringify
 * Prevents unexpected crashes due to parse/stringify errors of not serializable structures
 */
export namespace SafeJSON {
  export const parse = (data: string, logCb?: (err: unknown) => void): Json | undefined => {
    try {
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
    return Promise.resolve(JSON.parse(data) as Json);
  };

  /**
   * JSON.stringify as its. Silently Returns undefined in case of serialisation err
   */
  export function stringify(
    data: unknown,
    // eslint-disable-next-line functional/prefer-readonly-type
    replacer?: (number | string)[] | null,
    space?: string | number,
  ): string | undefined {
    try {
      return JSON.stringify(data, replacer, space);
    } catch (err) {
      return undefined;
    }
  }
}
