import { isSomething } from './is-it';
import { Integer, StringCaseInsensitive, StringEnum } from './types';

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

const camelOrPascalOrSnakeCase = /([a-z])([A-Z])|_/g;
export const toKebabCase = (str: string): string => {
  return str.replace(camelOrPascalOrSnakeCase, (_, p1, p2) => (p2 ? `${p1}-${p2}` : '-')).toLowerCase();
};
