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
});
