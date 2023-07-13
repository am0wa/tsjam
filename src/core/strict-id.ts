import { MapFn, Opaque } from './types';

type IdFactory<TValue, TResult> = {
  readonly create: MapFn<TValue | undefined, TResult>,
  readonly unknown: TResult
};

export type StringId<TName extends string = string> = Opaque<TName, string>;
export namespace StringId {
  export const create = <TName extends string>(value: string): StringId<TName> => value as StringId<TName>;
  export const factoryOf = <TIDName extends string>(defaultValue = ''): IdFactory<string, StringId<TIDName>> => (
    {
      create: (value) => StringId.create<TIDName>(value ?? defaultValue),
      unknown: StringId.create<TIDName>(defaultValue)
    }
  )
}

export type NumberId<TName extends string = string> = Opaque<TName, number>;
export namespace NumberId {
  export const create = <TName extends string>(value: number):NumberId<TName> => value as NumberId<TName>;
  export const factoryOf = <TIDName extends string>(defaultValue = -1): IdFactory<number, NumberId<TIDName>> => (
    {
      create: (value) => NumberId.create<TIDName>(value ?? defaultValue),
      unknown: NumberId.create<TIDName>(defaultValue)
    }
  )
}