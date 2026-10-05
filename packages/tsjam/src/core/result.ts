/** Successful outcome. */
export type Ok<T> = Readonly<{
  ok: true;
  value: T;
}>;

/** Failed outcome. */
export type Fail<E> = Readonly<{
  ok: false;
  error: E;
}>;

/**
 * Outcome of an operation that may fail – a plain, serializable discriminated union.
 * Narrow with `if (result.ok) result.value; else result.error`.
 */
export type Result<T, E = Error> = Ok<T> | Fail<E>;

export namespace Result {
  export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });

  export const fail = <E>(error: E): Fail<E> => ({ ok: false, error });

  export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.ok;

  export const isFail = <T, E>(result: Result<T, E>): result is Fail<E> => !result.ok;
}
