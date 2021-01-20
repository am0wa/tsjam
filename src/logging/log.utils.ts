import { isArrayLike, isObject } from '../core';

import { LogContext } from './types';

export const tagsLine = (tags: readonly string[] | undefined): string => {
  return tags?.length
    ? `[${tags.map(tag => `#${tag}`).join()}]`
    : ''
}

export const commonSensitiveFields = ['password', 'token', 'secret', 'sessionId'];

/**
 * Sanitizes sensitive Data.
 * Supports primitives, objects and arrays.
 */
export function sanitizeSensitiveData<T>(
  data: T,
  deep = false,
  sensitiveFields: readonly string[] = commonSensitiveFields,
): T {
  if (!isObject(data)) {
    return data;
  }
  if (isArrayLike(data)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    return data.map(one => sanitizeSensitiveData(one, deep, sensitiveFields)) as any;
  }
  const sanitized = { ...data };
  Object.keys(sanitized).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (sensitiveFields.find((sensitive) => key.match(sensitive))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      sanitized[key] = "***";
    }
    const value = sanitized[key];
    if (isObject(value)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      sanitized[key] = sanitizeSensitiveData(value, deep, sensitiveFields)
    }
  });
  return sanitized;
}

export const stringNode = (value: string | undefined): string => {
  return value?.length
    ? `[${value}]`
    : ''
}

export const contextLine = (context: LogContext | undefined): string => {
  if (!context) {
    return '';
  }

  // eslint-disable-next-line functional/no-let
  let line = ''
  Object.keys(context).forEach(key => {
    if (key == 'tags') {
      line += tagsLine(context[key])
    } else {
      line += key !== 'withStack' && key !== 'sanitize'
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        ? stringNode(`${context[key]}`)
        : ''
    }
  });
  return line
}
