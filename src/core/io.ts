/**
 * Input Output Utils for working with loading, serialization and file system.
 * Handy for fetching the *.json from REST APIs and files.
 */

/**
 * Cache Control which is used in fetch() data methods
 */
export enum CacheControl {
  /**
   * The default behavior of browsers when downloading resources.
   * The browser first looks inside the HTTP cache to see if there is a matching request.
   * If there is, and it is fresh, it will be returned from fetch().
   * If it exists but is stale, a conditional request is made to the remote server and if the server indicates
   * that the response has not changed, it will be read from the HTTP cache.
   * Otherwise it will be downloaded from the network, and the HTTP cache will be updated with the new response.
   */
  Default = 'default',

  /**
   * Bypass the HTTP cache completely.
   * This will make the browser not look into the HTTP cache on the way to the network,
   * and never store the resulting response in the HTTP cache.
   * Using this cache mode, fetch() will behave as if no HTTP cache exists.
   */
  NoStore = 'no-store',

  /**
   * Bypass the HTTP cache on the way to the network, but update it with the newly downloaded response.
   * This will cause the browser to never look inside the HTTP cache on the way to the network,
   * but update the HTTP cache with the downloaded response.
   * Future requests can use that updated response if appropriate.
   */
  Reload = 'reload',

  /**
   *  Always validate a response that is in the HTTP cache even if the browser thinks that it’s fresh.
   *  This will cause the browser to look for a matching request in the HTTP cache on the way to the network.
   *  If such a request is found, the browser always creates a conditional request to validate it
   *  even if it thinks that the response should be fresh.
   *  If a matching cached entry is not found, a normal request will be made.
   *  After a response has been downloaded, the HTTP cache will always be updated with that response.
   */
  NoCache = 'no-cache',

  /**
   *  The browser will always use a cached response if a matching entry is found in the cache,
   *  ignoring the validity of the response.
   *  Thus even if a really old version of the response is found in the cache,
   *  it will always be used without validation.
   *  If a matching entry is not found in the cache, the browser will make a normal request,
   *  and will update the HTTP cache with the downloaded response.
   */
  ForceCache = 'force-cache'
}

export const enum OriginControl {
  SameOrigin = 'same-origin',
  Cors = 'cors',
  NoCors = 'no-cors'
}

/**
 * Fetch does not fire reject event when external resources was not found.
 * So here is wrapper around it with handling not valid response
 */
export function fetchData(
  path: string,
  cache: CacheControl = CacheControl.ForceCache,
  mode?: OriginControl
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    fetch(path, { cache, mode })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then((response) => response.ok ? resolve(response) : reject(response))
      .catch((reason) => reject(reason));
  });
}
