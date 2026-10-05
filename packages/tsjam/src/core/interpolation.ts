/** Template {{key}} placeholders, key is case-sensitive. Group 1: key */
export const placeholderPattern = /\{\{(\w+)\}\}/g;

export const wordPattern = /\w+/;

/**
 * Extracts list of `{{key}}` tokens.
 * Complexity: O(n) in the template length.
 */
export const getPlaceholders = (template: string, pattern = placeholderPattern): string[] => {
  return template.match(pattern) ?? [];
};

/**
 * Interpolates `{{key}}` placeholders with own values of the provided object (inherited keys like `constructor` are ignored).
 * Complexity: O(n) in the template length.
 * @example
 *   interpolatePlaceholders('Hello, {{name}}!', { name: 'World' }); // 'Hello, World!'
 */
export const interpolatePlaceholders = (
  template: string,
  values: Record<string, unknown>,
  pattern = placeholderPattern,
  strict = false,
): string => {
  return template.replace(pattern, (placeholder: string, group?: unknown) => {
    // key from the capture group; custom patterns without one fall back to the first word
    const key = typeof group === 'string' ? group : (placeholder.match(wordPattern)?.[0] ?? '');
    const withValue = Object.hasOwn(values, key) ? values[key]?.toString() : undefined;
    if (withValue === undefined && strict) {
      throw new Error(`Interpolation Error: no value provided for '${placeholder}'`);
    }
    return withValue ?? '';
  });
};

/**
 * Template {{%key}}Conditional text{{/key}} placeholders, key is case-sensitive.
 * Group 1: key, Group 2: content
 */
export const conditionalPlaceholderPattern = /\{\{%(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

/**
 * Conditionally `{{%key}}Conditional text{{/key}}` drops sections between `{{%key}}` and `{{/key}}`
 * if the own value is falsy or missing.
 * Complexity: O(n) in the template length; O(n·k) worst case with k unclosed `{{%key}}` openers.
 */
export const interpolateConditionalPlaceholders = (
  template: string,
  values: Record<string, boolean>,
  pattern = conditionalPlaceholderPattern,
): string => {
  return template.replace(pattern, (_match: string, key: string, content: string) => {
    return Object.hasOwn(values, key) && values[key] ? content : '';
  });
};
