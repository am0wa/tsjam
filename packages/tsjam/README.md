# tsjam

**Vanilla Typescript Sweets**  
Not opinionated types, assertions, minimalistic utils, reactive tools

[TSJam API Documentation](https://am0wa.github.io/tsjam/modules.html)

## v1.7 Breaking Changes

- ESM only, no more CJS

_Note:_ Latest v6 stable CJS version is `v1.6.10`

## Usage Examples

### IsIt

Handy type guards, convenient to use in any `filter/map` like pipelines aka `options.filter(isSomething)`.

```typescript
// isSomething
isSomething('data'); // true
isSomething(''); // true
isSomething({}); // true
isSomething(null); // false
isSomething(undefined); // false

// isEmpty / isNotEmpty
isEmpty([]); // true
isEmpty(''); // true
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty([1, 2]); // false
isEmpty('text'); // false

// isObject
isObject({}); // true
isObject([]); // true
isObject('text'); // false
isObject(25); // false

// isString
isString('hello'); // true
isString(''); // true
isString(123); // false

// isInteger
isInteger(10); // true
isInteger(10.5); // false

// isTrue / isFalse
isTrue(1); // true
isTrue(true); // true
isTrue('true'); // false
isFalse(0); // true

// isObject
isObject({ a: 1 }); // true
isObject('text'); // false
isObject(undefined); // false

// isCallback
isCallback(() => {}); // true
isCallback(123); // false
```
