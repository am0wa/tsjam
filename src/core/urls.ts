import { isString } from './is-it';
import { SomeObject } from './types';

export namespace Urls {
  /**
   * Adds replaces url query string with params from key-value object or another query string
   *
   *     * Urls.fillUrl('https://foo.bar?search=pear', { search: 'apple', lang: 'en' }); // 'https://foo.bar?search=apple&lang=en'
   *     * Urls.fillUrl('https://foo.bar?search=pear', 'search=apple&lang=en');          // 'https://foo.bar?search=apple&lang=en'
   */
  export const fillUrl = (url: string, queryData: SomeObject | string): string => {
    const link = new URL(url);

    if (isString(queryData)) {
      const searchParams = new URLSearchParams(queryData);
      searchParams.forEach((value, key) => {
        link.searchParams.set(key, `${value}`);
      })
      return link.toString();
    }

    Object.entries(queryData).forEach(([key, value]) => {
      link.searchParams.set(key, `${value}`);
    })
    return link.toString();
  }

  /**
   * Converts all searchParams keys to lower-case.
   * Preserves values as it is.
   *
   *        * Urls.caseInsensitiveParams('https://foo.bar?UserId=John').toString();     // 'userid=John'
   *        * Urls.caseInsensitiveParams('https://foo.bar?UserId=John').has('userid');  // true
   */
  export const caseInsensitiveParams = (url: string): URLSearchParams => {
    const link = new URL(url);
    const urlParams = new URLSearchParams();
    link.searchParams.forEach((value, key) => {
      urlParams.set(key.toLowerCase(), `${value}`);
    })
    return urlParams;
  }
}