import { LogLevel } from './level.enum';

/**
 * String label for quick search across logs.
 * Note: '#' would be added automatically
 */
export type LogTag = string;

/**
 * Context which you could add as a first argument to any of jamLogger methods
 */
export interface LogContext {
  readonly [key: string]: unknown;
  readonly tags?: readonly LogTag[];
  readonly withStack?: boolean;
}

export type LogEntry = {
  readonly date: Date;
  readonly level: LogLevel;
  readonly message: string,
  readonly appId?: string,
  readonly context?: LogContext;
  readonly data?: readonly unknown[];
  readonly stack?: string;
}

/**
 * Implement this API in order to receive log writes into your custom output.
 */
export interface LogOutput {
  write(e: LogEntry): void;
}

/**
 * Sets the logLevel for your particular output channel.
 */
export type LogOutputChannel = {
  readonly out: LogOutput;
  readonly level?: LogLevel;
}
