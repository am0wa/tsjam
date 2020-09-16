import { isEquatable } from 'tsjam';

describe('Equatable',() => {

  it('false with primitives', () => {
    expect(isEquatable(5)).toBe(false);
  });   

  it('true with objects that have equals()', () => {
    expect(isEquatable({ equals: () => false })).toBe(true);
  });
})
// needed for imports and lint diffs check
export type EquatableSpec = string;
