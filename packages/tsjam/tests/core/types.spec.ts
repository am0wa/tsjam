import type { DeepPartial, Mutable } from 'core/types.js';

// Type-level checks – enforced by `tsc -p tests` (an unused @ts-expect-error fails the type-check).
describe('types', () => {
  it('DeepPartial - keeps functions callable, makes nested props optional', () => {
    type Config = { onChange: (v: number) => number; nested: { a: number; b: string } };
    const partial: DeepPartial<Config> = { nested: { a: 1 } };
    const withFn: DeepPartial<Config> = { onChange: (v) => v * 2 };
    expect(withFn.onChange?.(2)).toBe(4);
    expect(partial.nested?.b).toBeUndefined();
  });

  it('Mutable - is shallow', () => {
    type Deep = { readonly a: { readonly b: number } };
    const m: Mutable<Deep> = { a: { b: 1 } };
    m.a = { b: 2 };
    // @ts-expect-error – nested props stay readonly
    m.a.b = 3;
    expect(m.a.b).toBe(3);
  });
});
