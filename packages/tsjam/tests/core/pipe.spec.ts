import { not, pipeline } from 'core/pipe.js';

describe('pipe', () => {
  it('pipeline - applies steps left to right, changing types', () => {
    const result: boolean = pipeline(
      ' 42 ',
      (s) => s.trim(),
      Number,
      (n) => n * 2,
      (n) => n > 80,
    );
    expect(result).toBe(true);
  });

  it('pipeline - no steps returns the value', () => {
    expect(pipeline('x')).toBe('x');
  });

  it('pipeline - any number of same-type steps', () => {
    const inc = (n: number): number => n + 1;
    expect(pipeline(0, inc, inc, inc, inc, inc, inc, inc)).toBe(7);
  });

  it('not - negates a predicate', () => {
    const isEven = (n: number): boolean => n % 2 === 0;
    expect([1, 2, 3, 4].filter(not(isEven))).toEqual([1, 3]);
  });
});
