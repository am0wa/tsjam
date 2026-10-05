import { isSomething } from './is-it.js';
import type { Integer, StringCaseInsensitive, StringEnum } from './types.js';

/**
 * @return Returns integer from numeric string. Otherwise default value (0 by default).
 */
export const stringToInteger = (value: string | null | undefined, defaultValue: Integer = 0): Integer => {
  const n = parseInt(value || '', 10);
  return !isNaN(n) ? n : defaultValue;
};

/**
 * Handles boolean like primitives. For objects use `!!obj` directly.
 * @param value `string` *(case-insensitive)* | `number` | `boolean` | `null` | `undefined`
 * @return Returns `true` for `1`, `'1'`, `true`, `'true'` *(case-insensitive)* . Otherwise `false`.
 */
export const primitiveToBoolean = (value: StringCaseInsensitive | number | boolean | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || !!+value; // same as !!parseFloat(value)
  }

  return !!value;
};

/**
 * Finds matching enum value or returns `undefined` instead.
 *
 * Useful for "transforming" incoming raw string values from outside world (e.g. URL params) to our internal enum
 * (limited set of values). Safer than doing something naive like `someValue as MyEnum`.
 */
export const stringToEnum = <T extends StringEnum>(
  enumType: T,
  rawValue: string | undefined | null,
  ignoreCase = true,
): T[keyof T] | undefined => {
  if (!isSomething(rawValue)) {
    return undefined; // No matching enum value found
  }

  const alignCase = ignoreCase ? (x: string): string => x.toLowerCase() : (x: string): string => x;

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return Object.values(enumType).find((enumValue) => alignCase(enumValue) === alignCase(rawValue)) as
    | T[keyof T]
    | undefined;
};

/** Words of any casing: acronyms (`XML`), capitalised/lower words, digit runs kept inside their word (`v2`, `case2x`). */
const wordPattern = /[A-Z]+(?![a-z])(?:\d+[a-z]*)*|[A-Z]?[a-z]+(?:\d+[a-z]*)*|\d+[a-z]*/g;
const wordsOf = (str: string): string[] => str.match(wordPattern) ?? [];

/**
 * Any casing to kebab-case: `XMLHttpRequest` -> `xml-http-request`, `hello world` -> `hello-world`.
 * Complexity: O(n) in the string length.
 */
export const toKebabCase = (str: string): string => wordsOf(str).join('-').toLowerCase();

/** Complexity: O(n) in the string length. */
export const toUpperCaseFirst = (str: string): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

/** Already canonical camelCase – each later word is one capital + lowercase/digits (so not `userID`). */
const camelCasePattern = /^[a-z][a-z0-9]*(?:[A-Z][a-z0-9]+)*$/;

/**
 * Any casing to camelCase: `XMLParser` -> `xmlParser`, `_private` -> `private`, `hello_world` -> `helloWorld`.
 * Complexity: O(n) in the string length.
 */
export const toCamelCase = (str: string): string => {
  if (camelCasePattern.test(str)) {
    return str; // already canonical camelCase
  }
  return wordsOf(str)
    .map((word, i) => (i === 0 ? word.toLowerCase() : toUpperCaseFirst(word.toLowerCase())))
    .join('');
};
