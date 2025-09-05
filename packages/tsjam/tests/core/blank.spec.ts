import { blank, jamBlank } from 'core/blank.js';

describe('blank', () => {
  it('should be replace nullable with blank', () => {
    expect(jamBlank).toBe(blank.dash);
    expect(jamBlank).toBe(blank.dash);
  });
  it('should be customizable', () => {
    expect(blank.treeStars).toBe(blank.treeStars);
    expect(blank.treeStars).toBe(blank.treeStars);
  });
  it('mask with sign', () => {
    const password = '1252525353';
    const masked = '**********';
    expect(blank.mask(password).length).toBe(password.length);
    expect(blank.mask(password)).toBe(masked);
  });
  it('truncate overflow with sign', () => {
    const boringText = 'text is boring';
    expect(blank.truncate(boringText, 7)).toBe('text...');
    const coolText = 'text is';
    expect(blank.truncate(coolText, 7)).toBe('text is');
  });
});
