import { primitiveToBoolean, stringToEnum, stringToInteger } from 'core/from-it';

describe('fromIt', () => {
  describe('primitiveToBoolean', () => {
    it('should be true if its 1 / "1" or "true"', () => {
      expect(primitiveToBoolean(1)).toBe(true);
      expect(primitiveToBoolean('1')).toBe(true);
      expect(primitiveToBoolean('true')).toBe(true);
      expect(primitiveToBoolean('TRUE')).toBe(true);
    });
    it('should be case insensitive', () => {
      expect(primitiveToBoolean('true')).toBe(true);
      expect(primitiveToBoolean('True')).toBe(true);
      expect(primitiveToBoolean('TRUE')).toBe(true);
    });
    it('should be false if its 0 / "0" or "false"', () => {
      expect(primitiveToBoolean(0)).toBe(false);
      expect(primitiveToBoolean('0')).toBe(false);
      expect(primitiveToBoolean('false')).toBe(false);
    });
    it('should be false if its null or undefined', () => {
      expect(primitiveToBoolean(null)).toBe(false);
      expect(primitiveToBoolean(undefined)).toBe(false);
    });
    it('should pass through booleans - useful for undefined checks', () => {
      expect(primitiveToBoolean(true)).toBe(true);
      expect(primitiveToBoolean(false)).toBe(false);
    });
  });

  describe('stringToInteger', () => {
    it('should be integer if values is numeric', () => {
      expect(stringToInteger('0.25')).toBe(0);
      expect(stringToInteger('33')).toBe(33);
    });
    it('should be default if values is not numeric', () => {
      expect(stringToInteger('blah')).toBe(0);
    });
    it('should be default if its null or undefined', () => {
      expect(stringToInteger(null)).toBe(0);
      expect(stringToInteger(undefined)).toBe(0);
    });
    it('should be possible to redefine default', () => {
      expect(stringToInteger(undefined, -1)).toBe(-1);
    });
    it('should fallback to default if Infinity', () => {
      expect(stringToInteger('' + Infinity, -1)).toBe(-1);
    });
  });

  describe('toStringEnum', () => {
    enum TestEnum {
      Foo = 'fooValue',
      Bar = 'barValue',
      // NonStringOption = 1, // Managed to make it non-compilable for non-string enums
    }

    it('returns expected type (generic type test)', () => {
      function expectInputOfOptionalTestEnum(arg: TestEnum | undefined): arg is TestEnum {
        return !!arg;
      }
      expectInputOfOptionalTestEnum(stringToEnum(TestEnum, ''));
    });

    it('finds enum value', () => {
      expect(stringToEnum(TestEnum, 'fooValue')).toBe(TestEnum.Foo);
      expect(stringToEnum(TestEnum, 'barValue')).toBe(TestEnum.Bar);
    });

    it('case insensitive find enum value by default', () => {
      expect(stringToEnum(TestEnum, 'foovalue')).toBe(TestEnum.Foo);
      expect(stringToEnum(TestEnum, 'foo')).toBeUndefined();
    });

    it('case sensitive find if case not ignored', () => {
      expect(stringToEnum(TestEnum, 'foovalue', false)).toBeUndefined();
    });

    it('fails to find enum value', () => {
      expect(stringToEnum(TestEnum, 'Foo')).toBeUndefined();
      expect(stringToEnum(TestEnum, '')).toBeUndefined();
      expect(stringToEnum(TestEnum, undefined)).toBeUndefined();
      expect(stringToEnum(TestEnum, null)).toBeUndefined();
    });
  });
});
