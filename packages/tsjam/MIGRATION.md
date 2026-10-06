# Migrating to tsjam 2.0

Most of 2.0 is caught by the compiler: removed or renamed exports and reshaped types. Fix the errors it reports
using the tables below.

**Read section 1 first.** Those changes compile fine but return different results.

## 1. Behaviour changes the compiler can't catch

| API                                                                   | 1.x                                                                    | 2.0                                                                                                              | What to do                                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Collections.areEqual(a, b)` without a comparator                     | compared with `JSON.stringify` (structurally equal objects were equal) | compares with `Object.is` (same reference)                                                                       | pass a comparator for object lists: `areEqual(a, b, (x, y) => x.id === y.id)`                  |
| `DisposeBag.dispose()` / `Disposable.dispose()` / `autoDispose` order | first added, first disposed (FIFO)                                     | last added, first disposed (LIFO, like `DisposableStack`); `RxDisposable` still unsubscribes subscriptions first | if teardown order matters, register in acquisition order: dependents after what they depend on |
| `jamver.compareVersionsSemantically(base, candidate, '^' / '~')`      | `^` and `~` were swapped, and the minimum version wasn't checked       | npm meaning: `^1.2.3` = `>=1.2.3 <2.0.0`, `~1.2.3` = `>=1.2.3 <1.3.0`, `^0.x` locks the minor                    | review every call                                                                              |
| `jamver.compareVersionsSemantically(v1, v2, '>' / '<')`               | `>` meant `v1 > v2`                                                    | `>` means `v2 > v1` (the candidate against the base, as npm reads it)                                            | swap the arguments or the operator                                                             |
| version strings                                                       | `'1.2.'`, `'1abc'`, `'fake*'` were accepted                            | now throw `AssertionError`; `'>=1.2.3'` is accepted                                                              | validate the input                                                                             |
| `fetchData(path)` default cache                                       | `force-cache` (could serve stale responses)                            | `default` (normal HTTP caching)                                                                                  | pass `CacheControl.ForceCache` to keep the old behaviour                                       |
| `replayLatest()` with no argument                                     | replayed the whole history (`Infinity`)                                | replays the latest value (`1`)                                                                                   | `replayLatest(Infinity)` for the old behaviour                                                 |
| `isLocalhost` / `isValidUrl`                                          | pattern-matched, so `localhost.evil.com` counted as localhost          | parsed with `URL`: loopback IPs and upper-case hosts accepted; look-alikes, junk and non-http schemes rejected   | security fix, nothing to do                                                                    |
| `fillUrl(url, { a: null })`                                           | wrote `a=null` / `a=undefined`                                         | skips `null` / `undefined`; arrays become repeated keys                                                          | –                                                                                              |
| `toKebabCase` / `toCamelCase`                                         | wrong on acronyms, spaces, leading `_`                                 | `XMLHttpRequest → xml-http-request`, `_private → private`                                                        | –                                                                                              |
| `blank.emDash`                                                        | was an en dash `–`                                                     | real em dash `—`                                                                                                 | `blank.enDash` gives the old character                                                         |
| `isPercentage` (was `Percentage.isIt`)                                | any `number`, including `NaN`                                          | finite numbers only                                                                                              | –                                                                                              |
| `isCurrencyCode`                                                      | accepted retired codes                                                 | `HRK`, `SLL`, `VEF`, `ZWL`, `CUC` removed; `SLE`, `VES`, `ZWG`, `XCG` added                                      | –                                                                                              |
| `toErrorMessage`                                                      | `{ message: 42 }` returned `42`                                        | returns a string                                                                                                 | –                                                                                              |

## 2. Imports

| 1.x                                                                                                    | 2.0                                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `import { RxDisposable, RxVisible, replayLatest, replayLastMessage$, MessagingProvider } from 'tsjam'` | `from 'tsjam/reactive'` – the root `tsjam` no longer imports rxjs |
| `import { isUnsubscribable } from 'tsjam/reactive'`                                                    | `from 'tsjam'`                                                    |

`rxjs` is now an optional peer dependency. Install it only if you use `tsjam/reactive`.
`@tsjam/web-messaging` 0.3.0 requires `tsjam >= 1.9.2`.

## 3. Renamed

| 1.x                                                                                 | 2.0                                                             |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `Urls.fillUrl`, `Urls.caseInsensitiveParams`, `Urls.isLocalhost`, `Urls.isValidUrl` | `fillUrl`, `caseInsensitiveParams`, `isLocalhost`, `isValidUrl` |
| `math.closest`                                                                      | `closest`                                                       |
| `blank.mask`, `blank.truncate`                                                      | `mask`, `truncate` (`blank` keeps the sign strings)             |
| `Percentage.fromNumber`                                                             | `toPercentage`                                                  |
| `Percentage.calculate`                                                              | `calculatePercentage`                                           |
| `Percentage.within100`                                                              | `assertWithin100`                                               |
| `Percentage.isIt`                                                                   | `isPercentage`                                                  |
| `Equatable.areEqualByRef`                                                           | `areEqualByRef`                                                 |
| `Equatable.areEqual`                                                                | `areEqualByEquals`                                              |
| `Comparable.compare`                                                                | `compareComparables`                                            |
| `assert.exists`                                                                     | `assertExists`                                                  |
| `assert.never`                                                                      | `assertNever`                                                   |
| `assert.nonEmptyString`                                                             | `assertNonEmptyString`                                          |
| `assert.dev`                                                                        | `assertDev`                                                     |

`Percentage`, `Equatable` and `Comparable` are still types (an interface for the last two). Only their helper objects are gone.

`jamver` is now a plain object (`jamver.compareVersions(…)` works as before). TypeScript `import x = jamver.compareVersions` aliases only work on namespaces: use `const { compareVersions } = jamver`.

## 4. Reshaped

- **`Result`** is a plain-object union (serializable):
  - `result.isOk()` → `result.ok`
  - the failure's `.value` → `.error`
  - `Result.ok` / `Result.fail` take one type parameter
  - `Ok` / `Fail` are types, not classes, so there's no `new Ok()` and no `instanceof`
  - use `Result.isOk` / `Result.isFail` as guards
- **`Collections.equalByContent(a, b, keyOf)`**: the third argument is a key, not an equality predicate. `(a, b) => a.id === b.id` becomes `(item) => item.id`. It runs in O(n) instead of O(n²).
- **`ComparisonResult`** is a plain `as const` object, so the reverse mapping (`ComparisonResult[-1]`) is gone. `Comparator` and `Comparable.compare` return `number`, as `Array.sort` comparators do. Use `Math.sign` if you need exactly `-1 | 0 | 1`.
- **`SemanticRange`, `VersionSignificanceLvl`, `CacheControl`** are `as const` objects + union types instead of `enum`s (erasable TypeScript). `SemanticRange.Compatible` and `: SemanticRange` work as before; gone: the reverse mapping (`VersionSignificanceLvl[2]`), and plain literals like `'^'` are now assignable.
- **`RxDisposable._rxBag`** is an rxjs `Subscription`. `add()` returns `void`; there is no `size` / `id` / `disposed`.
- **`blank`** is an `as const` object, so its signs have literal types (`blank.dash: '-'`).
- **`JamError`** and its subclasses accept `options?: ErrorOptions` (`{ cause }`). `name` is non-enumerable, and the brand fields no longer exist at runtime.

## 5. Removed

| 1.x                                       | Replacement                                                          |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `RxBag`, `UnsubscribeCallback`            | `RxDisposable.autoDispose`, or an rxjs `Subscription`                |
| `shareReplayRefCount(n)`                  | rxjs `shareReplay({ bufferSize: n, refCount: true })`                |
| `enumerable` / `nonenumerable` decorators | `declare` fields (type-only), `#private`, or `Object.defineProperty` |
| `OriginControl`                           | `RequestMode` strings: `'cors'`, `'no-cors'`, `'same-origin'`        |

## 6. New in 2.0

- `clamp(value, min, max)`
- `StringId` / `NumberId` / `IdFactory` (branded ids: `StringId<'User'>`, `StringId.create`, `StringId.factoryOf`) – now exported (they existed but were never reachable)
- `roundTo(value, digits)`: same result as `+value.toFixed(digits)`, without the string round-trip
- `floorTo(value, digits)`: `floorTo(2.3, 2) → 2.3`, where `Math.floor(2.3 * 100) / 100` gives `2.29`
- `pipeline(value, ...fns)` and `not(predicate)`
- `import * as Collections from 'tsjam/collections'`: tree-shakes in every bundler
- fixes: `removeLast(list, 0)`, `removeSlice` with inverted bounds, `equalByContent` duplicates, `SafeJSON.parsePromise` rejects instead of throwing, interpolation ignores inherited keys such as `{{constructor}}`, `DeepPartial` keeps functions callable
