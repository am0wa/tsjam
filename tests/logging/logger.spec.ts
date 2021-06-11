import { createLogger, jsonStringifyTranslator } from 'logging';

describe("console output", () => {
  // eslint-disable-next-line jest/expect-expect
  it("check output", () => {
    const logger = createLogger({ translator: jsonStringifyTranslator })
    logger.debug('Hello');
    logger.debug('Hello', { list: ['A', 'B'] });
    logger.debug('Hello', 'A');
  });
  // eslint-disable-next-line jest/expect-expect
  it("check output withStack", () => {
    const logger = createLogger()
    // logger.debug({ withStack: false },'Some Error Without Stack');
    logger.error( { trimStack: 2 }, 'Some Error but with payload', new Error('Payload Err Object'));
    console.error('Console Error but with payload', ...[2, new Error('2nd Console Err Object')])
  });
})