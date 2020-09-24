import { JamError } from 'core/errors';

describe('Errors',() => {

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
})
