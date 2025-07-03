import {
  getPlaceholders,
  interpolateConditionalPlaceholders,
  interpolatePlaceholders,
  placeholderPattern,
} from 'core/interpolation';

describe('String template interpolation', () => {
  it('returns an empty array when template contains no interpolation tokens', () => {
    const template = 'Hello, world!';
    const result = getPlaceholders(template);
    expect(result).toEqual([]);
  });
  it('returns an array of multiple keys when template contains multiple interpolation tokens', () => {
    const template = 'Hello, {{name}}! Your order {{orderId}} is ready.';
    const result = getPlaceholders(template);
    expect(result).toEqual(['{{name}}', '{{orderId}}']);
  });
  it('returns an empty array when template is an empty string', () => {
    const template = 'Hello, {{name}}! Your order {{orderId}} is ready.';
    const result = interpolatePlaceholders(template, { name: 'world', orderId: 123 });
    expect(result).toEqual('Hello, world! Your order 123 is ready.');
  });
  it('should throw err in strict mode when NO value is not provided', () => {
    const template = 'Hello, {{name}}! Your order {{orderId}} is ready.';
    const interpolationError = new Error(`Interpolation Error: no value provided for '{{orderId}}'`);
    expect(() => interpolatePlaceholders(template, { name: 'world' }, placeholderPattern, true)).toThrow(
      interpolationError,
    );
  });
  it('should be able to assign empty string even in strict mode', () => {
    const template = 'Hello, {{name}}! Your order {{orderId}} is ready.';
    const result = interpolatePlaceholders(template, { name: 'world', orderId: '' }, placeholderPattern, true);
    expect(result).toEqual('Hello, world! Your order  is ready.');
  });
});

describe('Conditional template interpolation', () => {
  it('returns content within truthy section', () => {
    const template = 'Hello, {{%isBro}}Brother in Hood, {{/isBro}}Man!';
    const result = interpolateConditionalPlaceholders(template, { isBro: true });
    expect(result).toEqual('Hello, Brother in Hood, Man!');
  });
  it('returns an empty section when condition is falsy', () => {
    const template = 'Hello, {{%isBro}}Brother in Hood, {{/isBro}}Man!';
    const result = interpolateConditionalPlaceholders(template, { isBro: false });
    expect(result).toEqual('Hello, Man!');
  });
});
