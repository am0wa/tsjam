import { blank } from 'core/blank';

describe('blank', () => {
  it('should be replace nullable with blank', () => {
    expect(blank(null)).toBe(blank.dash);
    expect(blank(undefined)).toBe(blank.dash);
  });
  it('should be customizable', () => {
    expect(blank(null, blank.dots)).toBe(blank.dots);
    expect(blank(null, blank.stars)).toBe(blank.stars);
  });
  it('should not replace value', () => {
    expect(blank('some', blank.dots)).toBe('some');
    expect(blank('', blank.stars)).toBe('');
  });
  it('should narrows type if not null', () => {
    // eslint-disable-next-line functional/prefer-readonly-type
    let obj: undefined | { a: string | undefined } = { a: 'A' };
    expect(blank('some', blank.dots)).toBe('some');
    obj.a = undefined;
    if (Date.now() > 100000) {
      obj = undefined;
    }
    expect(blank('', blank.stars)).toBe('');
    const sign = blank(obj);
    expect(sign).toBe(blank.dash || 'A');
  });
  it('should be possible to bake sign', () => {
    const myBlank = blank.bake('$$$');
    const sanitized = myBlank(null);
    expect(sanitized).toBe('$$$');
  });
})