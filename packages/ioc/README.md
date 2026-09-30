# @tsjam/ioc

**[InversifyJS](https://inversify.io) v8 utilities** — service identifiers, disposable-aware modules, container bootstrap.

## Installation

```bash
npm install @tsjam/ioc inversify
```

## Usage

```typescript
import { createContainer, disposeAllInContainer, iocModule, sid } from '@tsjam/ioc';

const $GameStore = sid<GameStore>('$GameStore');

const container = createContainer({ defaultScope: 'Singleton' }, [
  {
    // drop-in for `new ContainerModule(...)`: resolved Disposable singletons are disposed on teardown
    module: iocModule(({ bind }) => {
      bind($GameStore).to(MyGameStore);
    }),
    autoInstantiate: [$GameStore],
  },
]);

// unbinds everything and disposes every ACTIVATED Disposable singleton (lazy bindings untouched)
disposeAllInContainer(container);
```

- `sid<T>(id)` — `Symbol.for(id)` typed as `ServiceIdentifier<T>`.
- `iocModule(load)` / `disposableBind(options)` — register an `onDeactivation` that disposes resolved instances — native `[Symbol.dispose]()` first, else `dispose()` (e.g. tsjam `Disposable`); no `@preDestroy` needed across inheritance chains.
- `initIOC` / `createContainer` — load `IOCModuleDescriptor`s and eagerly resolve their `autoInstantiate` services.
- `disposeInstance(value)` — structural teardown of any value: `[Symbol.dispose]()` first, else `dispose()`; ignores anything else.
- `autoInstantiateServices`, `disposeAllInContainer`, `SimpleFactory<T>`.

> Keep `dispose()` synchronous; `.toConstantValue()` bindings never deactivate (inversify design).

## Publish

From `packages/ioc`, logged in to npm as a `@tsjam` scope member (`npm whoami`):

```bash
pnpm version patch   # or minor / major; commit the bump
pnpm publish-public  # clean build + tests (prepublishOnly), then `pnpm publish --access=public`
```

`postpublish` then tags `HEAD` as `@tsjam/ioc@<version>` and pushes that tag to `origin`. Add `--otp=<code>` if npm 2FA is enabled.
