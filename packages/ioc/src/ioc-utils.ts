import {
  Container,
  ContainerModule,
  type ContainerModuleLoadOptions,
  type ContainerOptions,
  type ServiceIdentifier,
} from 'inversify';

import type { IOCModuleDescriptor } from './module.descriptor.js';

/**
 * A synchronous factory function — the v8-safe replacement for the removed
 * `SimpleFactory`. inversify v8's exported `Factory` widens the return to
 * `T | Promise<T>`; the engine's factories are synchronous, so we keep the narrow shape.
 */
export type SimpleFactory<T, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => T;

/**
 * Disposes any value honoring a structural disposal contract: the native `[Symbol.dispose]()`
 * (TC39 explicit resource management) first, else a `dispose()` method (e.g. tsjam `Disposable`).
 * Exactly one is invoked; anything else is ignored.
 */
export const disposeInstance = (instance: unknown): void => {
  if (instance === null || (typeof instance !== 'object' && typeof instance !== 'function')) {
    return;
  }
  const teardown: unknown = Reflect.get(instance, Symbol.dispose) ?? Reflect.get(instance, 'dispose');
  if (typeof teardown === 'function') {
    teardown.call(instance);
  }
};

/**
 * Batch not cached Services instantiation instead of calling container.get manually.
 */
export const autoInstantiateServices = (
  container: Container,
  serviceIds: readonly ServiceIdentifier<unknown>[],
): void => {
  serviceIds.forEach((id) => {
    container.get(id);
  });
};

/**
 * Wraps a ContainerModule's `bind` so every binding it creates also disposes its resolved instance
 * on unbind / {@link disposeAllInContainer}.
 *
 * inversify v8 reads `@preDestroy` from a class's OWN metadata, so a `dispose` declared on a base
 * (`Disposable`/`RxDisposable`) is invisible to subclass bindings — and v8's binding store is fully
 * `#private`, so the v6 `_bindingDictionary` sweep is gone. Instead of decorating every class in
 * every inheritance chain, this registers a service-level `onDeactivation` handler per binding: the
 * container walks its own binding store on teardown and invokes the handler only for ACTIVATED,
 * singleton-scoped bindings. So lazy/never-resolved bindings are not force-instantiated, deep
 * subclasses need no `@preDestroy`/`@injectFromBase`, and non-disposable values are ignored.
 *
 * Usage — change the module callback header only; the `bind(...)` body stays identical:
 * ```ts
 * new ContainerModule((options) => {
 *   const bind = disposableBind(options);
 *   bind($GameRoundStore).to(LiveGameRoundStore);
 * });
 * ```
 *
 * Note: `.toConstantValue()` bindings are unscoped and never deactivate (by design) — bind
 * disposables via `.to()` / `.toSelf()` / `.toDynamicValue()` to be covered.
 */
export const disposableBind = (options: ContainerModuleLoadOptions): ContainerModuleLoadOptions['bind'] => {
  return <T>(sid: ServiceIdentifier<T>) => {
    // fresh handler per binding: inversify keys deactivation relations by handler identity,
    // so one shared reference across service ids breaks `unbindAll()` ("Expecting model relation")
    options.onDeactivation(sid, (instance: unknown) => disposeInstance(instance));
    return options.bind(sid);
  };
};

/**
 * Drop-in replacement for `new ContainerModule(...)` that auto-wires {@link disposableBind} for
 * the whole module — the `bind` handed to the callback already registers disposal, so resolved
 * Disposable singletons are torn down on {@link disposeAllInContainer} with no per-binding
 * boilerplate and no chance of forgetting one.
 *
 * The container builds a fresh, plain-object `ContainerModuleLoadOptions` per load (every member a
 * closure / pre-bound method), so handing the callback `{ ...options, bind }` is safe — no `this`
 * loss, no cross-module leakage.
 *
 * ```ts
 * module: iocModule(({ bind }) => {
 *   bind($GameRoundStore).to(LiveGameRoundStore); // disposal auto-registered
 * });
 * ```
 */
export const iocModule = (load: (options: ContainerModuleLoadOptions) => void): ContainerModule => {
  // NOTE: block body (no implicit return). A concise-body module callback returns the fluent
  // binding object at runtime; leaking it as the ContainerModule callback's return makes inversify
  // throw "Unexpected asynchronous module load". Swallowing it keeps the load synchronous & void.
  return new ContainerModule((options) => {
    load({ ...options, bind: disposableBind(options) });
  });
};

/**
 * Dispose all activated Disposable singletons and unbind everything from the container.
 *
 * `unbindAll()` walks the container's binding store and runs each binding's deactivation. Disposal
 * itself is wired up by {@link disposableBind} (an `onDeactivation` handler per binding), so only
 * ACTIVATED, singleton-scoped bindings are disposed — no private-internal access, no
 * force-instantiation of lazy bindings.
 *
 * Keep `dispose()` synchronous; an async dispose would require `unbindAllAsync()`.
 */
export const disposeAllInContainer = (container: Container): void => {
  container.unbindAll();
};

export const initIOC = (container: Container, descriptors: IOCModuleDescriptor[], silent = false): Container => {
  container.load(...descriptors.map((d) => d.module));
  if (silent) {
    // do not autoInstantiate services in  silent mode
    return container;
  }
  descriptors.forEach((descriptor) => {
    autoInstantiateServices(container, descriptor.autoInstantiate);
  });

  return container;
};

export const createContainer = (options: ContainerOptions, descriptors: IOCModuleDescriptor[]): Container => {
  return initIOC(new Container(options), descriptors);
};

/** Creates service identifier for inversify as a Symbol */
export const sid = <T>(id: string): ServiceIdentifier<T> => Symbol.for(id);
