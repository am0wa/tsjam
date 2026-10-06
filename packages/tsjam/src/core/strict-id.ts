import type { MapFn, Opaque } from './types.js';

/** Factory of branded ids with a fallback for missing (`null` / `undefined`) values. */
export type IdFactory<TValue, TResult> = {
  readonly create: MapFn<TValue | null | undefined, TResult>;
  readonly unknown: TResult;
};

export type StringId<TName extends string = string> = Opaque<TName, string>;

/** Brands the value, no validation */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const createStringId = <TName extends string>(value: string): StringId<TName> => value as StringId<TName>;

/** Id factory; missing values become `defaultValue` (`''` by default) */
const stringIdFactoryOf = <TIDName extends string>(defaultValue = ''): IdFactory<string, StringId<TIDName>> => ({
  create: (value) => createStringId<TIDName>(value ?? defaultValue),
  unknown: createStringId<TIDName>(defaultValue),
});

/** `StringId` helpers – a `const` next to the same-named type (erasable, no runtime namespace). */
export const StringId = { create: createStringId, factoryOf: stringIdFactoryOf } as const;

export type NumberId<TName extends string = string> = Opaque<TName, number>;

/** Brands the value, no validation */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const createNumberId = <TName extends string>(value: number): NumberId<TName> => value as NumberId<TName>;

/** Id factory; missing values become `defaultValue` (`-1` by default) */
const numberIdFactoryOf = <TIDName extends string>(defaultValue = -1): IdFactory<number, NumberId<TIDName>> => ({
  create: (value) => createNumberId<TIDName>(value ?? defaultValue),
  unknown: createNumberId<TIDName>(defaultValue),
});

/** `NumberId` helpers – a `const` next to the same-named type (erasable, no runtime namespace). */
export const NumberId = { create: createNumberId, factoryOf: numberIdFactoryOf } as const;
