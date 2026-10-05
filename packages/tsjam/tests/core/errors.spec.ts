import type {
  ValidationError} from 'core/errors.js';
import {
  APIError,
  AssertionError,
  JamError,
  toErrorMessage,
  UnreachableCodeError
} from 'core/errors.js';

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

  describe('runtime shape', () => {
    it('has no brand fields, name is non-enumerable like native errors', () => {
      const err = new APIError(42, 'Not found');
      expect(Object.keys(err)).toEqual(['code']);
      expect(Object.getOwnPropertyNames(err)).not.toContain('_JamError');
      expect(err.name).toBe('APIError');
      expect(Object.getOwnPropertyDescriptor(err, 'name')?.enumerable).toBe(false);
    });

    it('passes cause through', () => {
      const cause = new Error('root');
      expect(new AssertionError('wrapped', { cause }).cause).toBe(cause);
      expect(new APIError('E1', 'wrapped', { cause }).cause).toBe(cause);
    });

    it('error classes are nominal – not assignable to each other', () => {
      // @ts-expect-error – an AssertionError is not a ValidationError
      const err: ValidationError = new AssertionError('x');
      expect(err).toBeInstanceOf(AssertionError);
    });
  });

  describe('toErrorMessage', () => {
    it('reads string messages, stringifies everything else', () => {
      expect(toErrorMessage(new Error('boom'))).toBe('boom');
      expect(toErrorMessage({ message: 'plain' })).toBe('plain');
      expect(toErrorMessage({ message: 42 })).toBe('[object Object]');
      expect(toErrorMessage('oops')).toBe('oops');
      expect(toErrorMessage(Symbol('s'))).toBe('Symbol(s)');
      expect(toErrorMessage(null)).toBe('null');
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
