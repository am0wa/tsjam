import { createLogger, jsonStringifyTranslator, LogLevel } from '@tsjam/logger';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('logger output', () => {
  // eslint-disable-next-line jest/expect-expect
  it('check output', () => {
    const logger = createLogger({ translator: jsonStringifyTranslator });
    logger.debug('Hello');
    logger.debug('Hello', { list: ['A', 'B'] });
    logger.debug('Hello', 'A');
  });
  // eslint-disable-next-line jest/expect-expect
  it('check output withStack', () => {
    const logger = createLogger();
    // logger.debug({ withStack: false },'Some Error Without Stack');
    logger.error({ trimStack: 2 }, 'Some Error but with payload', new Error('Payload Err Object'));
    console.error('Console Error but with payload', ...[2, new Error('2nd Console Err Object')]);
  });
  // eslint-disable-next-line jest/expect-expect
  it('check output errorPayloadStackLevel', () => {
    const logger = createLogger({ errorPayloadStackLevel: LogLevel.Error });
    // same as logger.debug({ withStack: false },'Some Error Without Stack');
    logger.warn('Some Error but with payload', new Error('Payload Err Object'));
    console.warn('Console Error but with payload', new Error('2nd Console Err Object'));
  });
});
