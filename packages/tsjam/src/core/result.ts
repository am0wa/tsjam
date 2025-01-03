export type Result<TOk, TFail> = Ok<TOk, TFail> | Fail<TOk, TFail>;

export class Ok<TOk, TFail> {
  constructor(readonly value: TOk) {}
  isOk(): this is Ok<TOk, TFail> {
    return true;
  }
}
export class Fail<TOk, TFail> {
  constructor(readonly value: TFail) {}
  isOk(): this is Ok<TOk, TFail> {
    return false;
  }
}

export namespace Result {
  export const ok = <TFail, TOk>(value: TOk): Result<TOk, TFail> => {
    return new Ok(value);
  };

  export const fail = <TFail, TOk>(value: TFail): Result<TOk, TFail> => {
    return new Fail(value);
  };
}
