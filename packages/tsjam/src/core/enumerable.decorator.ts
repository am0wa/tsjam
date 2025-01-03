/**
 * @enumerable decorator that sets the enumerable property of a class field to false|true.
 * @param flag false|true
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 */
export const enumerable = (flag: boolean) => {
  return (target: unknown, propertyName: string): void => {
    Object.defineProperty(target, propertyName, {
      // assessor descriptor
      get: function () {
        return undefined;
      },
      set: function (this: unknown, val: unknown) {
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
};

export const nonenumerable = enumerable(false);
