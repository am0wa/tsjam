/** Marker for Integer numbers */
export type Integer = number;
/** Marker for Float numbers */
export type Float = number;

/** An integer data type that can take a value of 1, 0 */
export type Bit = 0 | 1;

/** Unifies all option input flags */
export type BooleanLike = 'false' | 'true' | 'FALSE' | 'TRUE' | '0' | '1' | Bit | boolean;

/** Marker for Case Insensitive strings */
export type StringCaseInsensitive = string;
/** Marker for Case Sensitive strings */
export type StringCaseSensitive = string;

/** @see https://codemix.com/opaque-types-in-javascript/ */
export type Opaque<K extends string, T> = T & { readonly __TYPE__: K };

/** Typeguard for narrowing raw types for compilation-type checks */
export type Typeguard<T extends RawT, RawT = unknown> = (obj: RawT) => obj is T;

/**
 * Useful Type for prop access via []
 * @see suggestion: treat `in` operator as type guard which asserts property existence #21732
 * https://github.com/microsoft/TypeScript/issues/21732
 */
export type SomeObject = Record<string, unknown>;

/**
 * Approximate Type for String Enums
 * @see suggestion: allow "T extends enum" generic constraint #30611
 * https://github.com/microsoft/TypeScript/issues/30611
 */
export type StringEnum = Record<string, string>;
export type NumericEnum = { readonly [id: number]: string };

// eslint-disable-next-line functional/prefer-readonly-type
export type OneOrMany<T> = T | T[];

/** Helper type to retrieve `message` content from any type */
export type MessageOf<T extends { readonly message: unknown }> = T["message"];

/**
 * void 0 is effectively a compile time bulletproof constant for undefined with no look-up requirements.
 * difference is that some browsers allow to overwrite undefined, yet not void 0
 @example:
 readonly notification$: Observable<void>;
 ...
 notification$ = source$.pipe(
 mapTo(NoValue)
 );
 */
const NoValue = void 0; // void(0) - literally undefined
