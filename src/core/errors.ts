import { nonenumerable } from './enumerable.decorator';

export abstract class JamError extends Error {
  /**
   * Workaround for TypeScript duck-typing.
   * Working with classes we often needed to prevent A to be assigned to subtype B.
   *
   * - field is non-enumerable for clean logs and usage in IDE
   * - `!` is for `strictPropertyInitialization` TypeScript flag
   * - `never` must not have a reachable end point - never be used.
   */
  @nonenumerable
  protected readonly _JamError!: never;

  constructor(message: string) {
    // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = this.constructor.name; // define the name
  }
}

export class AssertionError extends JamError {
  @nonenumerable
  protected readonly _AssertionError!: never;
}

export class NotImplementedError extends JamError {
  @nonenumerable
  protected readonly _NotImplementedError!: never;
}

export class UnreachableCodeError extends Error {
  @nonenumerable
  protected readonly _UnreachableCodeError!: never;

  constructor(message = 'This code should be unreachable!') {
    super(message);
  }
}

export class ValidationError extends JamError {
  @nonenumerable
  protected readonly _ValidationError!: never;
}

export class ConfigurationError extends JamError {
  @nonenumerable
  protected readonly _ConfigurationError!: never;
}

export class APIError<ErrorCodeT = unknown> extends JamError {
  @nonenumerable
  protected readonly _APIError!: never;

  constructor(readonly code: ErrorCodeT, message: string) {
    super(message);
  }
}
