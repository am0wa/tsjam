import { Urls } from 'core/urls';

const TEST_URL = 'https://google.com/';

describe('TestUtils', () => {
  it('fillUrl when empty', () => {
    expect(Urls.fillUrl(TEST_URL, { search: 'apple', lang: 'en' })).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl with query', () => {
    expect(Urls.fillUrl(`${TEST_URL}?search=pear`, { search: 'apple', lang: 'en' })).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
  it('fillUrl with string query', () => {
    expect(Urls.fillUrl(`${TEST_URL}?search=pear`, 'search=apple&lang=en')).toBe(`${TEST_URL}?search=apple&lang=en`);
  });
});