/* eslint-disable functional/immutable-data,functional/prefer-readonly-type */
import { enumerable } from 'core';

class NonEnumerable {
  public readonly a = 1;
  private readonly b = 2;

  @enumerable(false)   // nonenumerable alias might be used
  c = 3;
}

describe("nonenumerable", () => {
  const nonEnumerable = new NonEnumerable();

  it("shouldn't iterate though nonenumerable field", () => {
    const keys = [];
    // eslint-disable-next-line functional/no-loop-statement
    for (const k in nonEnumerable) {
      keys.push(k);
    }
    expect(keys).toEqual(['a', 'b']);
  });

  it("shouldn't serialize nonenumerable fields", () => {
    expect(JSON.stringify(nonEnumerable)).toEqual('{"a":1,"b":2}');
  });

  it("should get value from object", () => {
    expect(nonEnumerable.c).toBe(3);
  });

  it("should set value from object", () => {
    nonEnumerable.c = 20;
    expect(nonEnumerable.c).toBe( 20);
  });

  it("Object.getOwnPropertyNames should return non-enumerable ones", () => {
    expect(Object.getOwnPropertyNames(nonEnumerable)).toEqual(['a', 'b', 'c']);
  });

  it("should support multiple instances", () => {
    const secondInstance = new NonEnumerable();
    secondInstance.c = 10;
    expect(nonEnumerable.c).toBe(20);
    expect(secondInstance.c).toBe(10);
  });

  it("should allow to delete the variable", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete nonEnumerable.c;
    expect(nonEnumerable.c).toBeUndefined();
  });
});
