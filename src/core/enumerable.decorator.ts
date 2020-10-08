/* eslint-disable functional/immutable-data, @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* @typescript-eslint/no-explicit-any */
/* @typescript-eslint/explicit-function-return-type */

/**
 * @enumerable decorator that sets the enumerable property of a class field to false|true.
 * @param flag false|true
 */
export function enumerable(flag: boolean) {
  return function (
    target: any,
    propertyName: string,
  ) {
    Object.defineProperty(target, propertyName, {
      get: function () { return undefined; },
      set: function (this: any, val: any) {
        Object.defineProperty(this, propertyName, {
          value: val,
          writable: true, // todo should not erase readonly
          enumerable: flag,
          configurable: true,
        });
      },
      enumerable: flag,
    });
  };
}

export const nonenumerable = enumerable(false);
