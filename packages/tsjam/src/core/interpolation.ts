/** Template {{key}} placeholders (case-insensitive) */
export const placeholderPattern = /\{\{\w+\}\}/gi;

export const wordPattern = /\w+/;

/** Extracts list of `{{key}}` token names */
export const getPlaceholders = (template: string, pattern = placeholderPattern): string[] => {
  return template.match(pattern) ?? [];
};

/**
 * Interpolates `{{key}}` placeholders with values from the provided object
 * @Example
 *   interpolatePlaceholders('Hello, {{name}}!', { name: 'World' }); // 'Hello, World!'
 */
export const interpolatePlaceholders = (
  template: string,
  values: Record<string, unknown>,
  pattern = placeholderPattern,
): string => {
  return template.replace(pattern, (placeholder: string) => {
    const key = placeholder.match(wordPattern)?.[0] ?? ''; // {{key}} -> key
    return values[key]?.toString() ?? '';
  });
};
