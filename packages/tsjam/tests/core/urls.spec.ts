import { Urls } from 'core/urls.js';

const TEST_URL = 'https://google.com/';

describe('TestUtils', () => {
  it('fillUrl when empty', () => {
    expect(Urls.fillUrl(TEST_URL, { search: 'apple', lang: 'en' })).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl with query', () => {
    expect(Urls.fillUrl(`${TEST_URL}?search=pear`, { search: 'apple', lang: 'en' })).toBe(
      `${TEST_URL}?search=apple&lang=en`,
    );
  });
  it('fillUrl with string query', () => {
    expect(Urls.fillUrl(`${TEST_URL}?search=pear`, 'search=apple&lang=en')).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl skips null / undefined, repeats keys for arrays', () => {
    expect(Urls.fillUrl(`${TEST_URL}?search=pear`, { search: undefined, lang: null, tag: ['a', 'b'] })).toBe(
      `${TEST_URL}?search=pear&tag=a&tag=b`,
    );
  });
  it('Case Insensitive params', () => {
    expect(Urls.caseInsensitiveParams(`${TEST_URL}?UserId=ABCd2`).toString()).toBe('userid=ABCd2');
  });
  it('is localhost', () => {
    expect(Urls.isLocalhost('http://localhost:9000/')).toBe(true);
    expect(Urls.isLocalhost('localhost')).toBe(true);
    expect(Urls.isLocalhost('LOCALHOST:8080')).toBe(true);
    expect(Urls.isValidUrl('http://localhost:9000/?cid=internal#abc')).toBe(true);

    expect(Urls.isLocalhost('https://google.com')).toBe(false);
  });
  it('is localhost - loopback IPs', () => {
    expect(Urls.isLocalhost('http://127.0.0.1:8080')).toBe(true);
    expect(Urls.isLocalhost('http://[::1]:3000')).toBe(true);
  });
  it('is localhost - not fooled by look-alikes', () => {
    expect(Urls.isLocalhost('localhost.evil.com')).toBe(false);
    expect(Urls.isLocalhost('http://localhost@evil.com')).toBe(false);
    expect(Urls.isLocalhost('localhostfoo')).toBe(false);
    expect(Urls.isLocalhost('https://evil.com/?r=localhost')).toBe(false);
  });
  it('is valid URl', () => {
    expect(Urls.isValidUrl('https://google.com')).toBe(true);
    expect(Urls.isValidUrl('https://google.com/?flag=1')).toBe(true);
    expect(Urls.isValidUrl('google.com')).toBe(true);
    expect(Urls.isValidUrl('www.google.com')).toBe(true);
    expect(Urls.isValidUrl('www.google.com:9090')).toBe(true);
    expect(Urls.isValidUrl('http://localhost:9000/')).toBe(true);
    expect(Urls.isValidUrl('localhost')).toBe(true);
    expect(Urls.isValidUrl('http://localhost:9000/?cid=internal#abc')).toBe(true);

    expect(Urls.isValidUrl('abc')).toBe(false);
  });
  it('is valid URl - case insensitive, IPs', () => {
    expect(Urls.isValidUrl('GOOGLE.COM')).toBe(true);
    expect(Urls.isValidUrl('https://Google.com')).toBe(true);
    expect(Urls.isValidUrl('http://127.0.0.1:8080')).toBe(true);
  });
  it('is valid URl - rejects junk and non-http schemes', () => {
    expect(Urls.isValidUrl('a.bc <script>')).toBe(false);
    expect(Urls.isValidUrl('')).toBe(false);
    expect(Urls.isValidUrl('ftp://files.example.com')).toBe(false);
    expect(Urls.isValidUrl('javascript:alert(1)')).toBe(false);
  });
});
