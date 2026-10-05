import { caseInsensitiveParams, fillUrl, isLocalhost, isValidUrl } from 'core/urls.js';

const TEST_URL = 'https://google.com/';

describe('TestUtils', () => {
  it('is exported flat from the root barrel', () => {
    expect(fillUrl).toBe(fillUrl);
    expect(isLocalhost).toBe(isLocalhost);
  });
  it('fillUrl when empty', () => {
    expect(fillUrl(TEST_URL, { search: 'apple', lang: 'en' })).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl with query', () => {
    expect(fillUrl(`${TEST_URL}?search=pear`, { search: 'apple', lang: 'en' })).toBe(
      `${TEST_URL}?search=apple&lang=en`,
    );
  });
  it('fillUrl with string query', () => {
    expect(fillUrl(`${TEST_URL}?search=pear`, 'search=apple&lang=en')).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl skips null / undefined, repeats keys for arrays', () => {
    expect(fillUrl(`${TEST_URL}?search=pear`, { search: undefined, lang: null, tag: ['a', 'b'] })).toBe(
      `${TEST_URL}?search=pear&tag=a&tag=b`,
    );
  });
  it('Case Insensitive params', () => {
    expect(caseInsensitiveParams(`${TEST_URL}?UserId=ABCd2`).toString()).toBe('userid=ABCd2');
  });
  it('is localhost', () => {
    expect(isLocalhost('http://localhost:9000/')).toBe(true);
    expect(isLocalhost('localhost')).toBe(true);
    expect(isLocalhost('LOCALHOST:8080')).toBe(true);
    expect(isValidUrl('http://localhost:9000/?cid=internal#abc')).toBe(true);

    expect(isLocalhost('https://google.com')).toBe(false);
  });
  it('is localhost - loopback IPs', () => {
    expect(isLocalhost('http://127.0.0.1:8080')).toBe(true);
    expect(isLocalhost('http://[::1]:3000')).toBe(true);
  });
  it('is localhost - not fooled by look-alikes', () => {
    expect(isLocalhost('localhost.evil.com')).toBe(false);
    expect(isLocalhost('http://localhost@evil.com')).toBe(false);
    expect(isLocalhost('localhostfoo')).toBe(false);
    expect(isLocalhost('https://evil.com/?r=localhost')).toBe(false);
  });
  it('is valid URl', () => {
    expect(isValidUrl('https://google.com')).toBe(true);
    expect(isValidUrl('https://google.com/?flag=1')).toBe(true);
    expect(isValidUrl('google.com')).toBe(true);
    expect(isValidUrl('www.google.com')).toBe(true);
    expect(isValidUrl('www.google.com:9090')).toBe(true);
    expect(isValidUrl('http://localhost:9000/')).toBe(true);
    expect(isValidUrl('localhost')).toBe(true);
    expect(isValidUrl('http://localhost:9000/?cid=internal#abc')).toBe(true);

    expect(isValidUrl('abc')).toBe(false);
  });
  it('is valid URl - case insensitive, IPs', () => {
    expect(isValidUrl('GOOGLE.COM')).toBe(true);
    expect(isValidUrl('https://Google.com')).toBe(true);
    expect(isValidUrl('http://127.0.0.1:8080')).toBe(true);
  });
  it('is valid URl - rejects junk and non-http schemes', () => {
    expect(isValidUrl('a.bc <script>')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('ftp://files.example.com')).toBe(false);
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });
});
