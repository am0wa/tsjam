import { JamError, UnreachableCodeError } from 'core/errors.js';

describe('Errors', () => {
  describe('subclassing', () => {
    class MyError extends JamError {}
    const myErr = new MyError('Hello MyError!');

    it('should be instanceof Error', () => {
      expect(myErr instanceof Error).toBe(true);
    });

    it('should be instanceof itself (subclass)', () => {
      expect(myErr instanceof MyError).toBe(true);
    });

    it('should have subclass name', () => {
      expect(myErr.name).toEqual('MyError');
    });

    it('message should much', () => {
      expect(myErr.message).toEqual('Hello MyError!');
    });

    it('should have stack', () => {
      expect(myErr.stack).toBeDefined();
    });
  });

  describe('UnreachableCodeError', () => {
    it('should be a JamError with its own name', () => {
      const err = new UnreachableCodeError();
      expect(err).toBeInstanceOf(JamError);
      expect(err).toBeInstanceOf(UnreachableCodeError);
      expect(err.name).toBe('UnreachableCodeError');
      expect(err.message).toBe('This code should be unreachable!');
    });
  });
});
