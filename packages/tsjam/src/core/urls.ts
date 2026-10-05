import { isString } from './is-it.js';
import type { SomeObject } from './types.js';

/**
 * Parses `url`, assuming `https://` when there is no host (`google.com`, `localhost:8080` –
 * the latter alone parses as scheme `localhost:` with an empty host).
 */
const parseUrl = (url: string): URL | null => {
  const link = URL.parse(url);
  return link?.hostname ? link : URL.parse(`https://${url}`);
};

const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Adds replaces url query string with params from key-value object or another query string.
 * `null` / `undefined` values are skipped, arrays become repeated keys.
 * Complexity: O(n) in the url and query size.
 *
 *     * fillUrl('https://foo.bar?search=pear', { search: 'apple', lang: 'en' }); // 'https://foo.bar?search=apple&lang=en'
 *     * fillUrl('https://foo.bar?search=pear', 'search=apple&lang=en');          // 'https://foo.bar?search=apple&lang=en'
 */
export const fillUrl = (url: string, queryData: SomeObject | string): string => {
  const link = new URL(url);

  if (isString(queryData)) {
    const searchParams = new URLSearchParams(queryData);
    searchParams.forEach((value, key) => {
      link.searchParams.set(key, value);
    });
    return link.toString();
  }

  Object.entries(queryData).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      link.searchParams.delete(key);
      value.forEach((item) => link.searchParams.append(key, `${item}`));
      return;
    }
    link.searchParams.set(key, `${value}`);
  });
  return link.toString();
};

/**
 * Converts all searchParams keys to lower-case.
 * Preserves values as it is.
 * Complexity: O(n) in the url size.
 *
 *        * caseInsensitiveParams('https://foo.bar?UserId=John').toString();     // 'userid=John'
 *        * caseInsensitiveParams('https://foo.bar?UserId=John').has('userid');  // true
 */
export const caseInsensitiveParams = (url: string): URLSearchParams => {
  const link = new URL(url);
  const urlParams = new URLSearchParams();
  link.searchParams.forEach((value, key) => {
    urlParams.set(key.toLowerCase(), value);
  });
  return urlParams;
};

/**
 * Whether the url's host is loopback: `localhost`, `127.0.0.1` or `[::1]` – parsed, not pattern-matched,
 * so `localhost.evil.com` or `http://localhost@evil.com` are not localhost.
 * Complexity: O(n) in the url size.
 */
export const isLocalhost = (url: string): boolean => loopbackHosts.has(parseUrl(url)?.hostname ?? '');

/**
 * Whether `url` parses as an http(s) url (scheme optional) with a dotted or loopback host.
 * Complexity: O(n) in the url size.
 */
export const isValidUrl = (url: string): boolean => {
  const link = parseUrl(url);
  return (
    link !== null &&
    (link.protocol === 'http:' || link.protocol === 'https:') &&
    (link.hostname.includes('.') || loopbackHosts.has(link.hostname))
  );
};
