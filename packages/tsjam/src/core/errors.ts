import { isObject } from './is-it.js';

/**
 * Base of tsjam errors – check them with `instanceof`.
 *
 * Each class carries a `declare`d brand field: a type-only nominal marker (emits nothing at runtime),
 * so structurally identical errors (e.g. `AssertionError` / `ValidationError`) are not assignable to each other.
 * Supports standard ES2022 `cause` chaining via `options`.
 */
export abstract class JamError extends Error {
  declare protected readonly _JamError: never;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    // non-enumerable like native Error#name, so logs / spreads show only real data
    Object.defineProperty(this, 'name', { value: new.target.name, writable: true, configurable: true });
  }
}

export class AssertionError extends JamError {
  declare protected readonly _AssertionError: never;
}

export class NotImplementedError extends JamError {
  declare protected readonly _NotImplementedError: never;
}

export class UnreachableCodeError extends JamError {
  declare protected readonly _UnreachableCodeError: never;

  constructor(message = 'This code should be unreachable!', options?: ErrorOptions) {
    super(message, options);
  }
}

export class ValidationError extends JamError {
  declare protected readonly _ValidationError: never;
}

export class ConfigurationError extends JamError {
  declare protected readonly _ConfigurationError: never;
}

export class APIError<ErrorCodeT = unknown> extends JamError {
  declare protected readonly _APIError: never;

  constructor(
    readonly code: ErrorCodeT,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

const isErrorWithMessage = (err: unknown): err is { readonly message: string } =>
  isObject(err) && typeof err.message === 'string';

/**
 * Message of anything thrown: `message` when it is a string, otherwise `String(err)` (safe for Symbols).
 * Complexity: O(1).
 */
export const toErrorMessage = (err: unknown): string => (isErrorWithMessage(err) ? err.message : String(err));
