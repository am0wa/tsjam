import * as root from 'core/index.js';
import { blank, jamBlank, mask, truncate } from 'core/blank.js';

describe('blank', () => {
  it('mask / truncate are flat root exports, blank holds only the signs', () => {
    expect(root.mask).toBe(mask);
    expect(root.truncate).toBe(truncate);
    expect(Object.values(blank).every((sign) => typeof sign === 'string')).toBe(true);
  });
  it('jamBlank is the dash', () => {
    expect(jamBlank).toBe('-');
  });
  it('emDash / enDash are the right characters', () => {
    expect(blank.emDash).toBe('—');
    expect(blank.enDash).toBe('–');
  });
  it('mask with sign', () => {
    const password = '1252525353';
    expect(mask(password)).toBe('**********');
    expect(mask('abc', '#')).toBe('###');
  });
  it('truncate overflow with sign', () => {
    expect(truncate('text is boring', 7)).toBe('text...');
    expect(truncate('text is', 7)).toBe('text is');
  });
  it('truncate never exceeds the limit, even below the sign length', () => {
    expect(truncate('hello world', 3)).toBe('...');
    expect(truncate('hello world', 2)).toBe('..');
    expect(truncate('hello world', 0)).toBe('');
    expect(truncate('hello world', -1)).toBe('');
  });
});
