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
export type Opaque<TName extends string, TValue> = TValue & { readonly __TYPE__: TName };

/** Typeguard for narrowing raw types for compilation-type checks */
export type Typeguard<T extends RawT, RawT = unknown> = (obj: RawT) => obj is T;

/**
 * Useful Type for prop access via []
 * @see suggestion: treat `in` operator as type guard which asserts property existence #21732
 * https://github.com/microsoft/TypeScript/issues/21732
 */
export type SomeObject = Record<string, unknown>;

/**
 * Fair JSON type.
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#more-recursive-type-aliases
 */
// eslint-disable-next-line functional/prefer-readonly-type
export type Json = number | string | null | boolean | Json[] | { [key: string]: Json };

/** Semantic Marker for the Callback function. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback = (...args: readonly any[]) => void;

/**
 * Approximate Type for String Enums
 * @see suggestion: allow "T extends enum" generic constraint #30611
 * https://github.com/microsoft/TypeScript/issues/30611
 */
export type StringEnum = Record<string, string>;
export type NumericEnum = { readonly [id: number]: string };

export type OneOrMany<T> = T | readonly T[];

/** Helper type to retrieve `message` content from any type */
export type MessageOf<T extends { readonly message: unknown }> = T['message'];

/** Helper for data parsing modifiers */
export type ParseFn<T, U> = (data: T) => U | undefined;

/** Literally – its not nullable ParseFn */
export type MapFn<T, U> = (info: T) => U;

/** Helper for pipeline like modifiers */
export type PipeFn<T, U> = (data: T, info?: U) => T;

/** Class Constructor agnostic type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Clazz<T> = new (...args: readonly any[]) => T;

/**
 * Rest in Peace Process Identifier.
 * Identifier number used to kill the entity when necessary.
 */
export type RipId = Opaque<'RipId', number>;
