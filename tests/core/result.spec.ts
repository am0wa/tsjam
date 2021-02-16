import { Result } from 'core/result';
type TestResult = Result<string, Error>;

describe('Result',() => {
  it('expect to infer types', () => {
    const result: TestResult = Result.ok('Yeah');
    expect(result.isOk()).toBe(true);
    let value = '';
    if (result.isOk()) {
      // eslint-disable-next-line prefer-destructuring
      value = result.value;
    }
    expect(value).toBe('Yeah');
  });
  it('expect fail infer types', () => {
    const result: TestResult = Result.fail(new Error('Dam'));
    expect(result.isOk()).toBe(false);
    let value: Error | null = null;
    if (!result.isOk()) {
      // eslint-disable-next-line prefer-destructuring
      value = result.value;
    }
    expect(value?.message).toBe('Dam');
  });
})
