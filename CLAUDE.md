# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`tsjam` is a published vanilla-TypeScript utility library ("not opinionated types, assertions, minimalistic utils, reactive tools"). This repo is a **pnpm workspace monorepo**; the library itself lives in `packages/tsjam`, and the other packages are shared build/lint/test configs and a small reactive messaging add-on.

## Repo layout

- `packages/tsjam` — the main published library (`tsjam` on npm). This is where ~all feature work happens.
- `packages/web-messaging` — `@tsjam/web-messaging`, a reactive `postMessage` host built on top of `tsjam` + rxjs.
- `packages/tsconfig-bases` — `@tsjam/tsconfig-bases`: shared `tsconfig.base.json` / `tsconfig.node.json` that all tsconfigs extend.
- `packages/lint-config` — `@tsjam/lint-config`: umbrella lint/format config. Re-exports everything from the ESLint config below (named + default) and ships the Prettier config. `exports` map: `.`, `./prettier.config.mjs` (what every package's `"prettier"` field points at), `./package.json`.
- `packages/eslint-config-recommended` — `@tsjam/eslint-config-recommended`: flat ESLint 10 config. Named exports (the module namespace is also the default export): `configs.recommendedTsTypeChecked` (needs `projectService`), `configs.recommendedTsSyntactic` (no type info), `configs.recommendedTS` (deprecated alias of the type-checked config), and rule helpers `restrictedImportsRule`, `restrictedImportPatterns`, `restrictedImports`, `namingConventionRule`. Overrides are split into syntactic vs type-aware fragments. `exports` map: `.` and `./package.json` only.
- `packages/swc-jest-config-recommended` — shared swc-based (ESM) Jest 30 config used by `tsjam`.
- `packages/web-dev-utils` — tiny CLI helpers (`open-browser.mjs`, `resolve-path.mjs`).

Dependency versions are pinned centrally via pnpm **catalogs** in `pnpm-workspace.yaml` (default `catalog:` plus named `catalog:lint`, `catalog:jest`, `catalog:swc`, `catalog:tools`). When bumping a shared dep, edit the catalog, not individual package.json files.

## TypeScript setup (dual compiler — read before touching TS versions)

The repo intentionally carries **two** TypeScript versions via the default catalog:

- `typescript` (**6.x**) — resolved by tooling that needs the classic JS compiler API: typescript-eslint and typedoc. Neither supports TS 7 yet (typescript-eslint caps at `<6.1.0`, typedoc at `6.0.x`).
- `typescript7` (**alias for `npm:typescript@7`, the native Go compiler**) — a devDependency of `tsjam` and `web-messaging`; its `tsc` binary wins on PATH in those packages, so **builds compile with TS 7** while lint/docs run on TS 6.

The alias name is load-bearing: peer resolution matches by the name `typescript` and climbs the dependents chain, so declaring `typescript@7` directly in `tsjam` would feed TS 7 to typescript-eslint and crash lint (`typescript@7` no longer ships the JS API). Don't "simplify" this to a single version until typescript-eslint/typedoc support TS 7 — then drop the alias and point `typescript` at `^7`.

TS 6/7 also removed config options; the tsconfigs are already migrated. Keep new tsconfigs free of `baseUrl` (use tsconfig-relative `paths` like `./src/*`), set `rootDir` explicitly (it now defaults to the tsconfig's own directory), and remember `types` defaults to `[]` (no auto-inclusion of `@types/*` — list what you need, as `tests/tsconfig.json` does).

## Commands

Run from the repo root (these proxy into `packages/tsjam` via `pnpm --filter=tsjam`):

```bash
pnpm build       # tsc -b src/tsconfig.json
pnpm test        # run the full jest suite
pnpm lint        # eslint src
pnpm format      # prettier --write across the repo
```

Inside `packages/tsjam` directly:

```bash
pnpm test                      # node --experimental-vm-modules jest tests
pnpm test:watch                # jest --watchAll
pnpm test -- tests/core/result.spec.ts        # single test file
pnpm test -- -t "expect to infer types"       # single test by name
pnpm build:watch               # tsc -b -w
pnpm doc                       # typedoc --tsconfig src/tsconfig.json -> docs/
pnpm clean                     # rimraf lib
```

Node `>=24` and pnpm `>=11` are required at the repo root (the published library itself supports Node `>=22`; everything is ESM-only, `"type": "module"`).

## Architecture & conventions

The library is organized into three export surfaces, all re-exported from `src/index.ts` and also published as subpath exports (`tsjam`, `tsjam/money`, `tsjam/reactive`, `tsjam/collections`):

- `src/core/` — pure utilities: type helpers (`types.ts`), assertions (`assert.ts`), type-narrowing unwrappers (`unwrap.ts`), `Result`, `Disposable`/`DisposeBag`, collections, math, etc. `collections.ts` is plain module exports (no `namespace`), grouped by the barrel as `export * as Collections` and published as `tsjam/collections` – the pilot for tree-shakable modules (a `namespace` compiles to an IIFE no bundler can shake; esbuild only shakes a direct `import * as`, hence the subpath).
- `src/reactive/` — rxjs-based tools: `RxDisposable`, operators, messaging. Depends on `core/`. `rxjs ^7` is a **peer dependency**.
- `src/money/` — ISO currency codes and money helpers.

Key patterns to follow when adding code:

- **Namespace + type pairing.** The dominant idiom is a type/class paired with a same-named `namespace` holding its factory/helper functions — e.g. `Result.ok()`/`Result.fail()`, `assert.exists()`/`assert.never()`, `StringId.create()`/`StringId.factoryOf()`, `unwrap.expected()`. Match this when extending.
- **Assertions narrow types.** `assert`/`unwrap` functions use `asserts x is T` signatures and throw `AssertionError` (from `errors.ts`). `assert` also short-circuits at runtime via the `__DEVELOPMENT__` global.
- **Disposable lifecycle.** Resource cleanup goes through `Disposable`/`DisposeBag` (core) and `RxDisposable` (reactive). `RxDisposable` keeps subscriptions in a plain rxjs `Subscription` (`_rxBag`, self-pruning) and tears down in order: subscriptions → children & callbacks → `disposed$`; `autoComplete$` completes public streams via `takeUntil(disposed$)`. Prefer `autoDispose(...)` over manual teardown.
- **ESM import extensions.** All relative imports use explicit `.js` extensions (e.g. `import { assert } from './assert.js'`) even in `.ts` source — required by NodeNext ESM resolution. New files must follow this.
- **`export *` barrels.** Each folder has an `index.ts` that `export *`s every module. Add new modules to the relevant barrel.
- New features need a matching `tests/<area>/<name>.spec.ts`. Tests import the library by **bare path from `src/`** (e.g. `import { Result } from 'core/result.js'`), enabled by `moduleDirectories: ['node_modules', 'src']` + `ts-jest-resolver` — not by relative path.

## ESLint specifics (strict, type-checked)

The root `eslint.config.mjs` layers repo overrides on top of `configs.recommendedTsTypeChecked`. Notable enforced rules: `consistent-type-imports` (use `import type`), `explicit-function-return-type`, `no-param-reassign`, and a `naming-convention` rule (variables `camelCase`/`PascalCase`/`UPPER_CASE`; a leading `_` is allowed). Inline `// eslint-disable-next-line` is the accepted escape hatch for unavoidable `any`/unsafe casts — follow the existing style rather than loosening config.

Flat config replaces a rule entry wholesale on override (no merging of options or patterns). The root `naming-convention` entry therefore replaces the shared private-member rule, and that's intentional: the codebase uses `_`-prefixed private fields. To extend a shared rule instead of replacing it, build the entry from the exported helpers (`restrictedImportsRule(...extra)`, spread `namingConventionRule`).

Both config packages are sealed by `exports` maps. Deep imports such as `@tsjam/eslint-config-recommended/eslint-recommended.mjs` fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`. When adding a new public file to either package, add it to both `files` and `exports`.

## Build & publish

- TS builds emit to `lib/` (gitignored) via project references; `src/tsconfig.json` is the build entry (compiled by the native TS 7 `tsc` — see the TypeScript setup section). Tests are transformed by `@swc/jest` (config in `@tsjam/swc-jest-config-recommended`'s `.swcrc`), so `tests/tsconfig.json` is now only for editor/type-checking (`noEmit`), not the test transform. All tsconfigs extend the package `tsconfig.json` which extends `@tsjam/tsconfig-bases/tsconfig.base.json`.
- Husky + lint-staged run `eslint --fix` and `prettier` on commit.
- Release flow for `tsjam`: `prepare-release` (clean → lint → test → version patch → docs) then `publish-public`; `postpublish` pushes tags to `origin master`.
