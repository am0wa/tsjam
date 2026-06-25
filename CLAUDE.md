# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`tsjam` is a published vanilla-TypeScript utility library ("not opinionated types, assertions, minimalistic utils, reactive tools"). This repo is a **pnpm workspace monorepo**; the library itself lives in `packages/tsjam`, and the other packages are shared build/lint/test configs and a small reactive messaging add-on.

## Repo layout

- `packages/tsjam` — the main published library (`tsjam` on npm). This is where ~all feature work happens.
- `packages/web-messaging` — `@tsjam/web-messaging`, a reactive `postMessage` host built on top of `tsjam` + rxjs.
- `packages/web-config-base` — `@tsjam/web-config-base`: shared `tsconfig.base.json`, prettier config, browserslist, and a `sync-browsers` CLI.
- `packages/eslint-config-recommended` — flat ESLint 9 config (`jamEslint.configs.recommendedTS`).
- `packages/jest-config-recommended` — shared ts-jest (ESM) Jest 30 config.
- `packages/swc-jest-config-recommended` — alternative swc-based Jest config.

Dependency versions are pinned centrally via pnpm **catalogs** in `pnpm-workspace.yaml` (`catalog:eslint19`, `catalog:jest30`, `catalog:`, etc.). When bumping a shared dep, edit the catalog, not individual package.json files.

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
pnpm doc                       # typedoc -> docs/
pnpm clean                     # rimraf lib
```

Node `>=22` and pnpm `>=10.3` are required (the library is ESM-only, `"type": "module"`).

## Architecture & conventions

The library is organized into three export surfaces, all re-exported from `src/index.ts` and also published as subpath exports (`tsjam`, `tsjam/money`, `tsjam/reactive`):

- `src/core/` — pure utilities: type helpers (`types.ts`), assertions (`assert.ts`), type-narrowing unwrappers (`unwrap.ts`), `Result`, `Disposable`/`DisposeBag`, collections, math, etc.
- `src/reactive/` — rxjs-based tools: `RxDisposable`, `RxBag`, operators, messaging. Depends on `core/`. `rxjs ^7` is a **peer dependency**.
- `src/money/` — ISO currency codes and money helpers.

Key patterns to follow when adding code:

- **Namespace + type pairing.** The dominant idiom is a type/class paired with a same-named `namespace` holding its factory/helper functions — e.g. `Result.ok()`/`Result.fail()`, `assert.exists()`/`assert.never()`, `StringId.create()`/`StringId.factoryOf()`, `unwrap.expected()`. Match this when extending.
- **Assertions narrow types.** `assert`/`unwrap` functions use `asserts x is T` signatures and throw `AssertionError` (from `errors.ts`). `assert` also short-circuits at runtime via the `__DEVELOPMENT__` global.
- **Disposable lifecycle.** Resource cleanup goes through `Disposable`/`DisposeBag` (core) and `RxDisposable`/`RxBag` (reactive, auto-unsubscribes via `takeUntil(disposed$)`). Prefer `autoDispose(...)` over manual teardown.
- **ESM import extensions.** All relative imports use explicit `.js` extensions (e.g. `import { assert } from './assert.js'`) even in `.ts` source — required by NodeNext ESM resolution. New files must follow this.
- **`export *` barrels.** Each folder has an `index.ts` that `export *`s every module. Add new modules to the relevant barrel.
- New features need a matching `tests/<area>/<name>.spec.ts`. Tests import the library by **bare path from `src/`** (e.g. `import { Result } from 'core/result.js'`), enabled by `moduleDirectories: ['node_modules', 'src']` + `ts-jest-resolver` — not by relative path.

## ESLint specifics (strict, type-checked)

The shared config runs typescript-eslint `recommendedTypeChecked`. Notable enforced rules: `consistent-type-imports` (use `import type`), `explicit-function-return-type`, `no-param-reassign`, and a `naming-convention` rule (camelCase/PascalCase/UPPER*CASE; leading `*`allowed). Inline`// eslint-disable-next-line`is the accepted escape hatch for unavoidable`any`/unsafe casts — follow the existing style rather than loosening config.

## Build & publish

- TS builds emit to `lib/` (gitignored) via project references; `src/tsconfig.json` is the build entry, `tests/tsconfig.json` (used by ts-jest) overrides module settings for Jest ESM. Both extend the root `tsconfig.json` which extends `@tsjam/web-config-base/tsconfig.base.json`.
- Husky + lint-staged run `eslint --fix` and `prettier` on commit.
- Release flow for `tsjam`: `prepare-release` (clean → lint → test → version patch → docs) then `publish-public`; `postpublish` pushes tags to `origin master`.
