import { MapFn, Opaque } from './types';

type IdFactory<TValue, TResult> = {
  readonly create: MapFn<TValue | undefined, TResult>,
  readonly unknown: TResult
};

const bakeFactoryOfType = <TValue>() =>
  <TID extends Opaque<string, TValue>>(fallback: TValue): IdFactory<TValue, TID> => {
  return {
    create: value => (value ?? fallback) as TID,
    unknown: fallback as TID
  };
}

export type StringId<TName extends string = string> = Opaque<TName, string>;
export namespace StringId {
  export const factory = bakeFactoryOfType<string>();
}

export type NumberId<TName extends string = string> = Opaque<TName, number>;
export namespace NumberId {
  export const factory = bakeFactoryOfType<number>();
}