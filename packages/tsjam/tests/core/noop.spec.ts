import { identity } from 'core';

describe('noop', () => {
  it('same should return same value', () => {
    const value = { a: 1, b: 2 };
    expect(identity(value)).toBe(value);
  });
  it('same should pass through the map', () => {
    const list = [{ a: 1 }, { b: 2 }];
    expect(list.filter(identity)).toEqual(list);
    expect(list.map(identity)).toEqual(list);
  });
  it('same should be possible to use as interface stub', () => {
    type Wheel = { move: (distance: number, speed: number) => void };
    const wheelStub: Wheel = { move: identity };
    wheelStub.move(25, 10);
  });
});
