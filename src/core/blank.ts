/**
 * It's not nice to show `null` or `undefined` to user,
 * use blank to hide nullables under user friendly string.
 *
 * Encourages usage of Nullish Coalescing operator...
 * Fyi:
 *  - to multiply signs use `string.repeat` api
 *  - to remove leading and trailing whitespaces use `string.trim` api
 *
 * @example
 * export const sameBlank = blank.emDash;
 * <p>{`username: ${user.name ?? sameBlank}`}</p>
 * <p>{`country: ${user.country ?? sameBlank}`}</p>
 */
export namespace blank {
  export const mask = (word: string, maskSign = star): string => {
    // return word.replace(/./g, maskSign);
    // Array(word.length+1).join(maskSign)
    return maskSign.repeat(word.length);
  }
  export const truncate = (word: string, limit= 120, overflowSign = treeDots): string => {
    return word.length > limit
      ? word.slice(0, limit - overflowSign.length) + overflowSign
      : word;
  }
  export const empty = '';
  export const dash = '-';
  export const emDash = '–';
  /** Hash sign or Number sign, also used as hashtags prefix */
  export const hash = '#';
  export const star = '*';
  export const dollar = '$';
  /** Known as Rest sign, literally to be Continued... */
  export const treeDots = '...';
  export const treeStars = '***';
  export const treeDollars = '$$$';
}

/**
 * Ready-made blank '-'
 * make all your empty fields look consistent.
 *
 * @example:
 *  <p>{`username: ${user.name ?? jamBlank}`}</p>
 *  <p>{`password: ${blank.mask(user.password)}`}</p>
 */
export const jamBlank = blank.dash;