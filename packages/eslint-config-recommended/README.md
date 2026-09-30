# @tsjam/eslint-config-recommended

**ESLint flat config with separate syntactic and type-aware rules**

Strict `typescript-eslint` based flat config for ESLint 10. Rules that need type information are kept apart from rules that work from syntax alone. That way you can choose full type-checked linting, or the fast syntactic config for files outside a TS program.

> Looking for ESLint + Prettier in one package? Use [@tsjam/lint-config](../lint-config), which re-exports everything below.

## Installation

```bash
npm install --save-dev @tsjam/eslint-config-recommended eslint
```

Requires ESLint `^10`. The package is ESM-only.

## Entry points

The package is sealed by an `exports` map. These are the only importable paths:

| Import path                                     | Contents                           |
| ----------------------------------------------- | ---------------------------------- |
| `@tsjam/eslint-config-recommended`              | ESLint flat configs + rule helpers |
| `@tsjam/eslint-config-recommended/package.json` | package metadata                   |

## Usage

### Type-checked

Based on `tsEslint.configs.recommendedTypeChecked`, with all shared overrides applied. The consumer must enable `projectService`:

```js
// eslint.config.mjs
import { configs } from '@tsjam/eslint-config-recommended';

export default [
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  ...configs.recommendedTsTypeChecked,
];
```

### Syntactic

Based on `tsEslint.configs.recommended`, and applies only the overrides that need no type information. It's faster and safe for plain `.js`/`.mjs` files:

```js
import { configs } from '@tsjam/eslint-config-recommended';

export default [...configs.recommendedTsSyntactic];
```

### Mixing both

Type-check TS sources and lint config/scripts syntactically:

```js
import { configs } from '@tsjam/eslint-config-recommended';

import tsEslint from 'typescript-eslint';

export default [
  ...configs.recommendedTsTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { files: ['**/*.{js,mjs}'], ...tsEslint.configs.disableTypeChecked },
];
```

`disableTypeChecked` switches off only the type-aware rules. The syntactic overrides still apply to those files.

The default export still works: `import jamEslint from '@tsjam/eslint-config-recommended'` → `jamEslint.configs.…`.

## Rule helpers

Flat config replaces a rule entry completely on override. It does not merge options or patterns. When you customize a shared rule, build the entry from these fragments so its shared settings aren't lost:

```js
import { configs, namingConventionRule, restrictedImportsRule } from '@tsjam/eslint-config-recommended';

const [severity, ...sharedNaming] = namingConventionRule['@typescript-eslint/naming-convention'];

export default [
  ...configs.recommendedTsTypeChecked,
  {
    rules: {
      // shared deep-relative / self-barrel patterns + your own
      ...restrictedImportsRule({ group: ['lodash'], message: 'Use lodash-es' }),
      // shared private-member rule + your own selectors
      '@typescript-eslint/naming-convention': [
        severity,
        ...sharedNaming,
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
      ],
    },
  },
];
```

| Export                            | What it is                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `restrictedImportsRule(...extra)` | a complete `no-restricted-imports` entry: shared patterns + `extra`                        |
| `restrictedImportPatterns`        | the raw shared patterns (deep `../../../*` imports, own/parent `./index` barrels)          |
| `restrictedImports`               | ready-made `{ rules }` block with only the shared patterns (not part of the configs)       |
| `namingConventionRule`            | the shared `@typescript-eslint/naming-convention` entry: private members camelCase, no `_` |

## What's inside

Rules in both configs:

- `no-param-reassign`, `no-multiple-empty-lines` (max 1, none at EOF), `no-nested-ternary` (warn)
- `explicit-function-return-type`
- `consistent-type-assertions: never` (no `as T` casts)
- `array-type: array`
- `no-unused-vars` (`_`-prefixed args allowed)
- `no-unused-expressions` (ternaries/short-circuits allowed)
- `no-namespace`, `member-ordering`, `default-param-last` and `explicit-module-boundary-types` switched off

Additional rules in `recommendedTsTypeChecked` only:

- `unbound-method` (static methods ignored)
- `naming-convention` (private members)
- `no-floating-promises`, `no-misused-promises`, `restrict-template-expressions` and `no-unsafe-enum-comparison` switched off

Both configs set `globals.browser` and ignore `node_modules`, `lib` and `dist`.

## Migrating from 0.3

- **`configs.recommendedTS` is renamed to `configs.recommendedTsTypeChecked`.** The old name still works but is deprecated.
- **The `recommended` and `recommendedTypeChecked` rule-fragment exports are removed.** Use the configs, or the rule helpers above.
- **Only the entry points above can be imported.** Other file paths inside the package, such as `eslint-recommended.mjs`, are blocked by the `exports` map.
