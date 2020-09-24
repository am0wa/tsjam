import { isEquatable } from 'core/equatable';

describe('Equatable',() => {

  it('false with primitives', () => {
    expect(isEquatable(5)).toBe(false);
  });   

  it('true with objects that have equals()', () => {
    expect(isEquatable({ equals: () => false })).toBe(true);
  });
})
