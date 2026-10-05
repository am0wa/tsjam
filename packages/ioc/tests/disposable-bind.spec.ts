import { bindingScopeValues, Container, ContainerModule, inject, injectable } from 'inversify';
import { RxDisposable } from 'tsjam/reactive';

import { jest } from '@jest/globals';

import { disposableBind, disposeAllInContainer, iocModule } from 'ioc-utils.js';

/**
 * `disposableBind` is the v8-safe replacement for the v6 `_bindingDictionary` dispose sweep.
 * It registers a service-level `onDeactivation` handler per binding, so `unbindAll()` disposes
 * every ACTIVATED singleton — WITHOUT relying on `@preDestroy`/`@injectFromBase` (v8 reads
 * preDestroy from own, non-inherited class metadata) and WITHOUT force-instantiating lazy bindings.
 */
describe('disposableBind', () => {
  const newContainer = (): Container => new Container({ defaultScope: bindingScopeValues.Singleton });

  it('disposes activated singletons (incl. deep subclasses) on unbindAll — no @preDestroy needed', () => {
    const disposeSpy = jest.fn();

    // Deep chain with NO @preDestroy / @injectFromBase anywhere.
    @injectable()
    class BaseStore extends RxDisposable {}
    @injectable()
    class MidStore extends BaseStore {} // intermediate level, no own dispose override
    @injectable()
    class LeafStore extends MidStore {
      override dispose(): void {
        super.dispose();
        disposeSpy('leaf');
      }
    }

    @injectable()
    class DepStore extends RxDisposable {
      constructor(@inject(LeafStore) readonly leaf: LeafStore) {
        super();
      }
      override dispose(): void {
        super.dispose();
        disposeSpy('dep');
      }
    }

    const mod = new ContainerModule((options) => {
      const bind = disposableBind(options);
      bind(LeafStore).toSelf();
      bind(DepStore).toSelf();
    });

    const container = newContainer();
    container.load(mod);
    container.get(DepStore); // resolves DepStore → LeafStore

    disposeAllInContainer(container);

    const calls = disposeSpy.mock.calls.map((c) => c[0]);
    expect(calls).toEqual(expect.arrayContaining(['leaf', 'dep']));
    expect(calls).toHaveLength(2);
  });

  it('does NOT dispose (or instantiate) bindings that were never resolved', () => {
    const createdSpy = jest.fn();
    const disposeSpy = jest.fn();

    @injectable()
    class NeverResolvedStore extends RxDisposable {
      constructor() {
        super();
        createdSpy();
      }
      override dispose(): void {
        super.dispose();
        disposeSpy();
      }
    }

    const mod = new ContainerModule((options) => {
      const bind = disposableBind(options);
      bind(NeverResolvedStore).toSelf();
    });

    const container = newContainer();
    container.load(mod);
    // intentionally never `get(NeverResolvedStore)`

    disposeAllInContainer(container);

    expect(createdSpy).not.toHaveBeenCalled(); // lazy binding not force-instantiated
    expect(disposeSpy).not.toHaveBeenCalled();
  });

  it('ignores non-disposable bindings without throwing', () => {
    @injectable()
    class PlainService {
      readonly name = 'plain';
    }

    const mod = new ContainerModule((options) => {
      const bind = disposableBind(options);
      bind(PlainService).toSelf();
    });

    const container = newContainer();
    container.load(mod);
    container.get(PlainService);

    expect(() => disposeAllInContainer(container)).not.toThrow();
  });

  it('disposes a singleton bound via toDynamicValue', () => {
    const disposeSpy = jest.fn();

    @injectable()
    class DynStore extends RxDisposable {
      override dispose(): void {
        super.dispose();
        disposeSpy();
      }
    }
    const $Dyn = Symbol.for('$Dyn');

    const mod = new ContainerModule((options) => {
      const bind = disposableBind(options);
      bind($Dyn).toDynamicValue(() => new DynStore());
    });

    const container = newContainer();
    container.load(mod);
    container.get($Dyn); // resolve the dynamic-value singleton

    disposeAllInContainer(container);

    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });

  it('disposes each instance once when the same store is resolved repeatedly (singleton)', () => {
    const disposeSpy = jest.fn();

    @injectable()
    class SingletonStore extends RxDisposable {
      override dispose(): void {
        super.dispose();
        disposeSpy();
      }
    }

    const mod = new ContainerModule((options) => {
      const bind = disposableBind(options);
      bind(SingletonStore).toSelf();
    });

    const container = newContainer();
    container.load(mod);
    const a = container.get(SingletonStore);
    const b = container.get(SingletonStore);
    expect(a).toBe(b); // same singleton instance

    disposeAllInContainer(container);

    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});

/**
 * `iocModule` is the drop-in `new ContainerModule(...)` replacement that pre-wires
 * {@link disposableBind} — the `bind` destructured in the callback is already the disposing one,
 * so modules need NO per-binding boilerplate.
 */
describe('iocModule', () => {
  const newContainer = (): Container => new Container({ defaultScope: bindingScopeValues.Singleton });

  it('auto-disposes resolved singletons without any explicit disposableBind call', () => {
    const disposeSpy = jest.fn();

    @injectable()
    class Store extends RxDisposable {
      override dispose(): void {
        super.dispose();
        disposeSpy('store');
      }
    }
    @injectable()
    class Dep extends RxDisposable {
      constructor(@inject(Store) readonly store: Store) {
        super();
      }
      override dispose(): void {
        super.dispose();
        disposeSpy('dep');
      }
    }

    // NOTE: plain `({ bind })` — no `const bind = disposableBind(options)`.
    const container = newContainer();
    container.load(
      iocModule(({ bind }) => {
        bind(Store).toSelf();
        bind(Dep).toSelf();
      }),
    );
    container.get(Dep);

    disposeAllInContainer(container);

    const calls = disposeSpy.mock.calls.map((c) => c[0]);
    expect(calls).toEqual(expect.arrayContaining(['store', 'dep']));
    expect(calls).toHaveLength(2);
  });

  it('preserves normal binding/resolution semantics (deps wired, singleton identity)', () => {
    @injectable()
    class Dependency {
      readonly value = 42;
    }
    const $Service = Symbol.for('$Service');
    @injectable()
    class Service {
      constructor(@inject(Dependency) readonly dep: Dependency) {}
    }

    const container = newContainer();
    container.load(
      iocModule(({ bind }) => {
        bind(Dependency).toSelf();
        bind($Service).to(Service);
      }),
    );

    const a = container.get<Service>($Service);
    const b = container.get<Service>($Service);
    expect(a).toBe(b); // singleton
    expect(a.dep.value).toBe(42); // dependency injected
    expect(container.isBound(Service)).toBe(false); // bound only via $Service identifier
  });

  it('does not dispose never-resolved bindings', () => {
    const disposeSpy = jest.fn();
    @injectable()
    class Lazy extends RxDisposable {
      override dispose(): void {
        super.dispose();
        disposeSpy();
      }
    }

    const container = newContainer();
    container.load(iocModule(({ bind }) => bind(Lazy).toSelf()));
    // never resolved

    disposeAllInContainer(container);
    expect(disposeSpy).not.toHaveBeenCalled();
  });
});

/**
 * Disposal is structural — no tsjam dependency: native `[Symbol.dispose]()` (TC39 explicit
 * resource management) is honored first, else a `dispose()` method.
 */
describe('structural disposal contract', () => {
  const newContainer = (): Container => new Container({ defaultScope: bindingScopeValues.Singleton });

  it('disposes a native Symbol.dispose resource', () => {
    const disposeSpy = jest.fn();

    @injectable()
    class NativeResource implements Disposable {
      [Symbol.dispose](): void {
        disposeSpy();
      }
    }

    const container = newContainer();
    container.load(iocModule(({ bind }) => bind(NativeResource).toSelf()));
    container.get(NativeResource);

    disposeAllInContainer(container);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });

  it('invokes only Symbol.dispose when both contracts are present', () => {
    const nativeSpy = jest.fn();
    const methodSpy = jest.fn();

    @injectable()
    class DualResource {
      [Symbol.dispose](): void {
        nativeSpy();
      }
      dispose(): void {
        methodSpy();
      }
    }

    const container = newContainer();
    container.load(iocModule(({ bind }) => bind(DualResource).toSelf()));
    container.get(DualResource);

    disposeAllInContainer(container);
    expect(nativeSpy).toHaveBeenCalledTimes(1);
    expect(methodSpy).not.toHaveBeenCalled();
  });

  it('ignores a non-callable dispose property', () => {
    const $Value = Symbol.for('$NonCallableDispose');

    const container = newContainer();
    container.load(iocModule(({ bind }) => bind($Value).toDynamicValue(() => ({ dispose: 'not-a-function' }))));
    container.get($Value);

    expect(() => disposeAllInContainer(container)).not.toThrow();
  });
});
