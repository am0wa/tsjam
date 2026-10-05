import { CacheControl, fetchData, OriginControl } from 'core/io.js';

describe('fetchData', () => {
  const originalFetch = globalThis.fetch;
  let lastInit: RequestInit | undefined;

  const stubFetch = (result: () => Promise<Response>): void => {
    globalThis.fetch = (_input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      lastInit = init;
      return result();
    };
  };

  afterEach(() => {
    globalThis.fetch = originalFetch;
    lastInit = undefined;
  });

  it('resolves with an ok response, passing cache and mode', async () => {
    stubFetch(() => Promise.resolve(new Response('{"a":1}', { status: 200 })));
    const response = await fetchData('/data.json', CacheControl.NoStore, OriginControl.Cors);
    expect(await response.json()).toEqual({ a: 1 });
    expect(lastInit).toEqual({ cache: 'no-store', mode: 'cors' });
  });

  it('uses the default HTTP cache by default', async () => {
    stubFetch(() => Promise.resolve(new Response('', { status: 200 })));
    await fetchData('/data.json');
    expect(lastInit?.cache).toBe('default');
  });

  it('rejects with the Response when it is not ok', async () => {
    stubFetch(() => Promise.resolve(new Response('missing', { status: 404 })));
    await expect(fetchData('/missing.json')).rejects.toMatchObject({ ok: false, status: 404 });
  });

  it('rejects with the network error', async () => {
    const networkError = new TypeError('Failed to fetch');
    stubFetch(() => Promise.reject(networkError));
    await expect(fetchData('/data.json')).rejects.toBe(networkError);
  });

  it('OriginControl is a runtime object', () => {
    expect(OriginControl.SameOrigin).toBe('same-origin');
  });
});
