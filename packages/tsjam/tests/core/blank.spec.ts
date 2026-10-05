import { blank, jamBlank } from 'core/blank.js';

describe('blank', () => {
  it('jamBlank is the dash', () => {
    expect(jamBlank).toBe('-');
  });
  it('emDash / enDash are the right characters', () => {
    expect(blank.emDash).toBe('—');
    expect(blank.enDash).toBe('–');
  });
  it('mask with sign', () => {
    const password = '1252525353';
    expect(blank.mask(password)).toBe('**********');
    expect(blank.mask('abc', '#')).toBe('###');
  });
  it('truncate overflow with sign', () => {
    expect(blank.truncate('text is boring', 7)).toBe('text...');
    expect(blank.truncate('text is', 7)).toBe('text is');
  });
  it('truncate never exceeds the limit, even below the sign length', () => {
    expect(blank.truncate('hello world', 3)).toBe('...');
    expect(blank.truncate('hello world', 2)).toBe('..');
    expect(blank.truncate('hello world', 0)).toBe('');
    expect(blank.truncate('hello world', -1)).toBe('');
  });
});
