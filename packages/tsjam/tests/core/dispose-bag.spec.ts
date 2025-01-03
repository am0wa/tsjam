/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DisposeBag } from 'core';

describe('DisposeBag', () => {
  it('dispose - has to dispose all immediately after dispose invocation', () => {
    const bag = DisposeBag.create();

    let a: string | undefined;
    let b: string | undefined;
    let c: string | undefined;
    const cbA = {
      dispose: () => {
        a = 'A';
      },
    };
    const cbB = () => (b = 'B');
    const cbC = () => (c = 'C');

    bag.add(cbA);
    bag.add(cbB);
    expect(bag.size).toBe(2);

    expect(a).toBeUndefined();
    expect(b).toBeUndefined();

    bag.dispose();
    expect(bag.disposed).toBe(true);

    expect(a).toBe('A');
    expect(b).toBe('B');

    expect(c).toBeUndefined();
    bag.add(cbC);
    expect(c).toBe('C');
    expect(bag.size).toBe(0);
  });
  it('dispose - to avoid extra invocations when disposed', () => {
    const bag = DisposeBag.create();

    let invocations = 0;
    const cbD = {
      dispose: () => {
        invocations++;
      },
    };

    bag.add(cbD);
    bag.dispose();
    bag.dispose();
    expect(bag.size).toBe(0);
    expect(invocations).toBe(1);
  });
});
