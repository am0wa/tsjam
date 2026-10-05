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
export const blank = {
  empty: '',
  dash: '-',
  /** Em dash `—` (U+2014) */
  emDash: '—',
  /** En dash `–` (U+2013) */
  enDash: '–',
  /** Hash sign or Number sign, also used as hashtags prefix */
  hash: '#',
  star: '*',
  dollar: '$',
  /** Known as Rest sign, literally to be Continued... */
  treeDots: '...',
  treeStars: '***',
  treeDollars: '$$$',
} as const;

/** Replaces every character with `maskSign`. Complexity: O(n). */
export const mask = (word: string, maskSign: string = blank.star): string => {
  return maskSign.repeat(word.length);
};

/**
 * Cuts `word` to at most `limit` characters, ending with `overflowSign` when cut
 * (the sign itself is cut too when it does not fit the limit).
 * Complexity: O(n).
 */
export const truncate = (word: string, limit = 120, overflowSign: string = blank.treeDots): string => {
  if (word.length <= limit) {
    return word;
  }
  const max = Math.max(0, limit);
  const keep = Math.max(0, max - overflowSign.length);
  return (word.slice(0, keep) + overflowSign).slice(0, max);
};

/**
 * Ready-made blank '-'
 * make all your empty fields look consistent.
 *
 * @example:
 *  <p>{`username: ${user.name ?? jamBlank}`}</p>
 *  <p>{`password: ${mask(user.password)}`}</p>
 */
export const jamBlank = blank.dash;
