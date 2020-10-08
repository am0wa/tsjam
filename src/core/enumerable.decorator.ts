/* eslint-disable functional/immutable-data, @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* @typescript-eslint/no-explicit-any */
/* @typescript-eslint/explicit-function-return-type */

/**
 * @enumerable decorator that sets the enumerable property of a class field to false|true.
 * @param flag false|true
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 */
export function enumerable(flag: boolean) {
  return function (
    target: any,
    propertyName: string,
  ) {
    Object.defineProperty(target, propertyName, { // assessor descriptor
      get: function () { return undefined; },
      set: function (this: any, val: any) {
        Object.defineProperty(this, propertyName, {
          value: val,
          writable: true, // not immutable
          enumerable: flag,
          configurable: true,
        });
      },
      enumerable: flag,
      configurable: true,
    });
  };
}

export const nonenumerable = enumerable(false);
