/** Template {{key}} placeholders (case-insensitive) */
export const placeholderPattern = /\{\{\w+\}\}/gi;

export const wordPattern = /\w+/;

/** Extracts list of `{{key}}` token names */
export const getPlaceholders = (template: string, pattern = placeholderPattern): string[] => {
  return template.match(pattern) ?? [];
};

/**
 * Interpolates `{{key}}` placeholders with values from the provided object
 * @example
 *   interpolatePlaceholders('Hello, {{name}}!', { name: 'World' }); // 'Hello, World!'
 */
export const interpolatePlaceholders = (
  template: string,
  values: Record<string, unknown>,
  pattern = placeholderPattern,
  strict = false,
): string => {
  return template.replace(pattern, (placeholder: string) => {
    const key = placeholder.match(wordPattern)?.[0] ?? ''; // {{key}} -> key
    const withValue = values[key]?.toString();
    if (withValue === undefined && strict) {
      throw new Error(`Interpolation Error: no value provided for '${placeholder}'`);
    }
    return withValue ?? '';
  });
};

/**
 * Template {{%key}}Conditional text{{/key}} placeholders (key is case-insensitive)
 * Group 1: key, Group 2: content
 */
export const conditionalPlaceholderPattern = /\{\{%(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

/**
 * Conditionally `{{%key}}Conditional text{{/key}}` drops sections between `{{%key}}` and `{{/key}}` if the value is falsy.
 */
export const interpolateConditionalPlaceholders = (
  template: string,
  values: Record<string, boolean>,
  pattern = conditionalPlaceholderPattern,
): string => {
  return template.replace(pattern, (_match: string, key: string, content: string) => {
    return values[key] ? content : '';
  });
};
