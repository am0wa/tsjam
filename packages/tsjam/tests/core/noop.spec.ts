import { identity, noop, noValue } from 'core/noop.js';

describe('noop', () => {
  it('identity - returns the same value', () => {
    const value = { a: 1, b: 2 };
    expect(identity(value)).toBe(value);
  });
  it('identity - passes through filter / map', () => {
    const list = [{ a: 1 }, { b: 2 }];
    expect(list.filter(identity)).toEqual(list);
    expect(list.map(identity)).toEqual(list);
  });
  it('noop - stubs a void method', () => {
    type Wheel = { move: (distance: number, speed: number) => void };
    const wheelStub: Wheel = { move: noop };
    expect(wheelStub.move(25, 10)).toBeUndefined();
  });
  it('noValue - is undefined', () => {
    expect(noValue).toBeUndefined();
  });
});
