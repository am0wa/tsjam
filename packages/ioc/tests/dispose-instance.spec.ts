import { jest } from '@jest/globals';

import { disposeInstance } from 'ioc-utils.js';

describe('disposeInstance', () => {
  it('invokes native [Symbol.dispose]()', () => {
    const spy = jest.fn();
    disposeInstance({ [Symbol.dispose]: spy });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('invokes a dispose() method', () => {
    const spy = jest.fn();
    disposeInstance({ dispose: spy });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('prefers [Symbol.dispose]() and invokes exactly one when both are present', () => {
    const nativeSpy = jest.fn();
    const methodSpy = jest.fn();
    disposeInstance({ [Symbol.dispose]: nativeSpy, dispose: methodSpy });
    expect(nativeSpy).toHaveBeenCalledTimes(1);
    expect(methodSpy).not.toHaveBeenCalled();
  });

  it('binds `this` to the instance', () => {
    class Resource {
      disposed = false;
      dispose(): void {
        this.disposed = true;
      }
    }
    const resource = new Resource();
    disposeInstance(resource);
    expect(resource.disposed).toBe(true);
  });

  it('resolves inherited teardown through the prototype chain', () => {
    const spy = jest.fn();
    class Base {
      [Symbol.dispose](): void {
        spy();
      }
    }
    class Leaf extends Base {}
    disposeInstance(new Leaf());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('disposes a function value carrying a dispose() method', () => {
    const spy = jest.fn();
    const fn = Object.assign(() => undefined, { dispose: spy });
    disposeInstance(fn);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ignores a non-callable dispose property', () => {
    expect(() => disposeInstance({ dispose: 'not-a-function' })).not.toThrow();
  });

  it.each([null, undefined, 0, 42, '', 'str', true, Symbol('s'), 10n, {}, []])('ignores non-disposable %p', (value) => {
    expect(() => disposeInstance(value)).not.toThrow();
  });
});
