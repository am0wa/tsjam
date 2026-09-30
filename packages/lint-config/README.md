# @tsjam/lint-config

**Shared ESLint + Prettier config module**

One package to lint them all: strict ESLint flat config (via [@tsjam/eslint-config-recommended](../eslint-config-recommended)) + opinionated Prettier config with import sorting.

## Installation

```bash
npm install --save-dev @tsjam/lint-config eslint prettier @trivago/prettier-plugin-sort-imports
```

Requires Node `>=24` and ESLint `^10`. The package is ESM-only. Optionally add `husky` + `lint-staged` for pre-commit hooks.

## Entry points

The package is sealed by an `exports` map. These are the only importable paths:

| Import path                              | Contents                           |
| ---------------------------------------- | ---------------------------------- |
| `@tsjam/lint-config`                     | ESLint flat configs + rule helpers |
| `@tsjam/lint-config/prettier.config.mjs` | Prettier config                    |
| `@tsjam/lint-config/package.json`        | package metadata                   |

## Usage

### ESLint

Type-checked config. The consumer must enable `projectService`:

```js
// eslint.config.mjs
import { configs } from '@tsjam/lint-config';

export default [
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  ...configs.recommendedTsTypeChecked,
];
```

Syntactic config. It needs no type information, so it's faster and safe for plain `.js`/`.mjs` files:

```js
import { configs } from '@tsjam/lint-config';

export default [...configs.recommendedTsSyntactic];
```

The default export still works: `import jamLint from '@tsjam/lint-config'` → `jamLint.configs.…`.

#### Rule helpers

Flat config replaces a rule entry completely on override. When you customize these rules, build the entry from the shared fragment so its settings aren't lost:

```js
import { configs, restrictedImportsRule } from '@tsjam/lint-config';

export default [
  ...configs.recommendedTsTypeChecked,
  {
    files: ['src/**'],
    // shared deep-relative / self-barrel patterns + your own
    rules: restrictedImportsRule({ group: ['lodash'], message: 'Use lodash-es' }),
  },
];
```

- `restrictedImportsRule(...extraPatterns)`: a complete `no-restricted-imports` entry (shared patterns + yours).
- `restrictedImportPatterns`: the raw shared patterns.
- `restrictedImports`: a ready-made `{ rules }` block with only the shared patterns.
- `namingConventionRule`: the shared `@typescript-eslint/naming-convention` entry (private members camelCase, no leading `_`).

### Prettier

Reference the shared config from your `package.json`:

```json
{
  "prettier": "@tsjam/lint-config/prettier.config.mjs"
}
```

or extend it in your own `prettier.config.mjs`:

```js
export { default } from '@tsjam/lint-config/prettier.config.mjs';
```

### Pre-commit hooks (optional)

With `husky` + `lint-staged` installed:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"],
    "*.{ts,tsx,js,mjs,json,md}": ["prettier --write"]
  }
}
```

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

## What's inside

- **ESLint:** `typescript-eslint` base plus stricter additions: `explicit-function-return-type`, `consistent-type-assertions` (no `as T` casts), `no-param-reassign`, and restricted deep-relative / self-barrel imports. Overrides are split into rules that work from syntax alone and rules that need type information. `recommendedTsSyntactic` applies only the first group. `recommendedTsTypeChecked` applies both.
- **Prettier:** 120 print width, single quotes, trailing commas, and grouped import order via `@trivago/prettier-plugin-sort-imports`.

## Migrating from 1.x

- **Node `>=24` is required.** Node 22 is no longer supported.
- **`configs.recommendedTS` is renamed to `configs.recommendedTsTypeChecked`.** The old name still works but is deprecated.
- **Only the entry points above can be imported.** Other file paths inside the package are blocked by the `exports` map.
