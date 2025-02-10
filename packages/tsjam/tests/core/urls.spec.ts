import { Urls } from 'core/urls';

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
  it('is valid URl', () => {
    expect(Urls.isValidUrl('https://google.com')).toBe(true);
    expect(Urls.isValidUrl('https://google.com/?flag=1')).toBe(true);
    expect(Urls.isValidUrl('google.com')).toBe(true);
    expect(Urls.isValidUrl('www.google.com')).toBe(true);

    expect(Urls.isValidUrl('abc')).toBe(false);
  });
});
