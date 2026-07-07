# @tsjam/lint-config

**Shared ESLint + Prettier config module**

One package to lint them all: strict type-checked ESLint flat config (via [@tsjam/eslint-config-recommended](../eslint-config-recommended)) + opinionated Prettier config with import sorting.

## Installation

```bash
npm install --save-dev @tsjam/lint-config eslint prettier @trivago/prettier-plugin-sort-imports
```

Optionally add `husky` + `lint-staged` for pre-commit hooks.

## Usage

### ESLint

```js
// eslint.config.mjs
import jamLint from '@tsjam/lint-config';

export default [...jamLint.configs.recommendedTS];
```

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

- **ESLint** — `typescript-eslint` `recommendedTypeChecked` base with stricter additions: `explicit-function-return-type`, `consistent-type-assertions` (no `as T` casts), `no-param-reassign`, restricted deep-relative / self-barrel imports.
- **Prettier** — 120 print width, single quotes, trailing commas, and grouped import order via `@trivago/prettier-plugin-sort-imports`.
