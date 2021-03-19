import { createLogger, jsonStringifyTranslator } from 'logging';

describe("console output", () => {
  // eslint-disable-next-line jest/expect-expect
  it("check output", () => {
    const logger = createLogger({ translator: jsonStringifyTranslator })
    logger.debug('Hello');
    logger.debug('Hello', { list: ['A', 'B'] });
    logger.debug('Hello', 'A');
  });
})