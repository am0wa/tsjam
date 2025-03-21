import { getPlaceholders, interpolatePlaceholders } from 'core/interpolation';

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
});
