import { Result } from 'core/result.js';

type TestResult = Result<string, Error>;

describe('Result', () => {
  it('ok - narrows to value', () => {
    const result: TestResult = Result.ok('Yeah');
    expect(result.ok).toBe(true);
    let value = '';
    if (result.ok) {
      value = result.value;
    }
    expect(value).toBe('Yeah');
  });

  it('fail - narrows to error', () => {
    const result: TestResult = Result.fail(new Error('Dam'));
    expect(result.ok).toBe(false);
    let error: Error | null = null;
    if (!result.ok) {
      error = result.error;
    }
    expect(error?.message).toBe('Dam');
  });

  it('defaults the error type to Error', () => {
    const result: Result<number> = Result.fail(new Error('nope'));
    expect(Result.isFail(result) && result.error.message).toBe('nope');
  });

  it('is plain serializable data', () => {
    const ok = Result.ok({ id: 1 });
    const fail = Result.fail('boom');
    expect(structuredClone(ok)).toEqual({ ok: true, value: { id: 1 } });
    expect(JSON.parse(JSON.stringify(fail))).toEqual({ ok: false, error: 'boom' });
  });

  it('isOk / isFail - guards usable as filter predicates', () => {
    const results: Result<number, string>[] = [Result.ok(1), Result.fail('x'), Result.ok(2)];
    const values = results.filter(Result.isOk).map((r) => r.value);
    const errors = results.filter(Result.isFail).map((r) => r.error);
    expect(values).toEqual([1, 2]);
    expect(errors).toEqual(['x']);
  });
});
