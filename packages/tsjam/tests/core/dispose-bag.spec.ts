/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DisposeBag } from 'core/dispose-bag.js';

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
  it('dispose - disposes all even if a teardown throws, then rethrows', () => {
    const bag = DisposeBag.create();
    const boom = new Error('boom');
    let afterCalls = 0;
    const after = () => afterCalls++;

    bag.add(() => {
      throw boom;
    });
    bag.add(after);

    expect(() => bag.dispose()).toThrow(boom);
    expect(afterCalls).toBe(1);
    expect(bag.disposed).toBe(true);
    expect(bag.size).toBe(0);
  });
  it('dispose - aggregates multiple teardown errors', () => {
    const bag = DisposeBag.create();
    const errA = new Error('A');
    const errB = new Error('B');
    bag.add(() => {
      throw errA;
    });
    bag.add(() => {
      throw errB;
    });

    let caught: unknown;
    try {
      bag.dispose();
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(AggregateError);
    expect(caught instanceof AggregateError && caught.errors).toEqual([errA, errB]);
  });
  it('dispose - items added during disposal are disposed immediately', () => {
    const bag = DisposeBag.create();
    let lateCalls = 0;
    const late = () => lateCalls++;
    bag.add(() => bag.add(late));

    bag.dispose();
    expect(lateCalls).toBe(1);
    expect(bag.size).toBe(0);
  });
  it('add - same item twice is kept and disposed once', () => {
    const bag = DisposeBag.create();
    let calls = 0;
    const teardown = () => calls++;

    bag.add(teardown);
    bag.add(teardown);
    expect(bag.size).toBe(1);

    bag.dispose();
    expect(calls).toBe(1);
  });
  it('delete - releases the item without disposing it', () => {
    const bag = DisposeBag.create();
    let calls = 0;
    const teardown = () => calls++;
    bag.add(teardown);

    expect(bag.delete(teardown)).toBe(true);
    expect(bag.size).toBe(0);

    bag.dispose();
    expect(calls).toBe(0);
  });
  it('delete - returns false for an unknown item and after dispose', () => {
    const bag = DisposeBag.create();
    const teardown = () => undefined;
    expect(bag.delete(teardown)).toBe(false);

    bag.add(teardown);
    bag.dispose();
    expect(bag.delete(teardown)).toBe(false);
  });
});
