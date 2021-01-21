/**
 * It's not nice to show `null` or `undefined` to user,
 * use blank to hide nullables under user friendly string
 */
export function blank<T>(maybe: T | undefined | null, sign = '-'): NonNullable<T> | string {
  return maybe ?? sign;
}

export namespace blank {
  /**
   * Create your own Blank function, so all blank fields in your project would be replaced with same sign.
   */
  export const bake = (sign = '-'): <T>(maybe: T | undefined | null) => NonNullable<T> | string => {
    return (x) => blank(x, sign);
  }
  export const empty = '';
  export const dash = '-';
  export const emDash = '–';
  export const dots = '...';
  export const stars = '***';
}