import { isSomething } from '../core';

import { ConsoleOutput } from './console.output';
import { LogLevel } from './level.enum';
import { commonSensitiveFields, sanitizeSensitiveData } from './log.utils';
import { LogOutputRegistry } from './output.registry';
import { LogContext, LogEntry, LogMessage, LogOutputChannel, LogTag, LogTranslator } from './types';

interface LogMethod {
  // eslint-disable-next-line functional/prefer-readonly-type,@typescript-eslint/no-explicit-any
  (message: string, ...args: any[]): void;

  // eslint-disable-next-line functional/prefer-readonly-type,@typescript-eslint/no-explicit-any
  (context: LogContext, message: string, ...args: any[]): void;
}

/** Log distribution by available channels */
const write = (logEntry: LogEntry, outputChannels: LogOutputRegistry): void => {
  try {
    outputChannels
      .byLogLevel(logEntry.level)
      .forEach(o => o.write(logEntry));
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error('Failed to write Logs', err);
  }
}

const createStack = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const stack: string = new Error().stack!.replace("Error\n", "");
  const out: readonly string[] = stack.split("\n")
    .filter(line => !line.includes('logger.')); // remove logger related lines

  return out.join("\n");
}

const bakeLogWithLevel = (
  level: LogLevel,
  outputChannels: LogOutputRegistry,
  tags: readonly LogTag[],
  appId?: string,
  translator: LogTranslator = emptyTranslator
): LogMethod => {
  // eslint-disable-next-line functional/prefer-readonly-type,@typescript-eslint/no-explicit-any
  return (...args: any[]): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const argsContext: LogContext = typeof args[0] === 'string'
      ? { /* empty */ }
      // eslint-disable-next-line functional/immutable-data
      : { ...args.shift() };

    const context = {
      ...argsContext,
      tags: argsContext.tags?.length ? argsContext.tags?.concat(tags) : tags.slice()
    }

    // we show stack for Errors unless its turned off. yet we show stack for any level if its passed in context
    const stack = level === LogLevel.Error && !isSomething(context.withStack) || !!context.withStack
      ? createStack()
      : ''

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,functional/immutable-data
    const message: string = typeof args[0] === 'string' ? args.shift() : '';
    // eslint-disable-next-line functional/no-let
    let logMessage: LogMessage = { message, optionalParams: args };
    if (context.sanitize) {
      logMessage = sanitizeSensitiveTranslator.map(logMessage, context.sanitize);
    }
    if (context.stringify) {
      logMessage = jsonStringifyTranslator.map(logMessage);
    }
    logMessage = translator.map(logMessage);

    write(
      {
        date: new Date(),
        level,
        appId,
        context,
        message: logMessage.message,
        data: logMessage.optionalParams,
        stack
      },
      outputChannels
    )
  }
}

export namespace Logger {
  // eslint-disable-next-line functional/no-let
  let defaultChannels: readonly LogOutputChannel[] = [
    { out: new ConsoleOutput() }
  ];

  export const setDefaultChannels = (...channels: readonly LogOutputChannel[]): void => {
    defaultChannels = channels;
  }

  export const getDefaultChannels = (): readonly LogOutputChannel[] => {
    return defaultChannels;
  }
}

/**
 * Not Opinionated ts Logger with:
 * - appId (distinguish log between multiple instances)
 * - tags support (tag child loggers, find and filter certain logs super-fast)
 * - multiple channels output (you could add your own one: e.g. for parallel monitoring; @see `LoggerOptions`)
 * - sensitive fields sanitization (perf optimized, customizable: @see `LogContext`)
 * - stack output of any call (configurable: @see `LogContext`)
 */
export interface Logger {
  readonly appId: string;
  readonly error: LogMethod,
  readonly warn: LogMethod,
  readonly info: LogMethod,
  readonly debug: LogMethod,
  readonly channels: LogOutputRegistry;
  readonly tags: readonly LogTag[];
  /**
   * Creates Child logger with added tags.
   * Note: AppId and Channels are reused and remain same.
   */
  readonly tagged: (...tags: readonly LogTag[]) => Logger
}

export const emptyTranslator: LogTranslator = {
  map(logMessage: LogMessage): LogMessage {
    return logMessage;
  }
}

/**
 * Invokes JSON.stringify on log data arguments.
 */
export const jsonStringifyTranslator: LogTranslator = {
  map: ( { message, optionalParams } ) => {
    return { message, optionalParams: optionalParams.map((one) => JSON.stringify(one)) };
  }
}

/**
 * Sanitizes all sensitive data that should not be exposed.
 * For performance optimization – it's good to sanitize data ONLY in places when it's actually needed.
 */
export const sanitizeSensitiveTranslator: LogTranslator<readonly string[]> = {
  map({ message, optionalParams }: LogMessage, sensitive = commonSensitiveFields): LogMessage {
    return { message, optionalParams: sanitizeSensitiveData(optionalParams, true, sensitive) };
  }
}

type LoggerOptions = {
  /** Application Id - to distinguish loggers of multiple instances of your Apps or services */
  readonly appId?: string,
  /** Stream your log simultaneously into multiple output channels */
  readonly channels?: readonly LogOutputChannel[],
  /** Tag your logger, so it would be easily to filter logs */
  readonly tags?: readonly LogTag[]
  /** Implement your custom transformation of your log data before write, e.g sanitize */
  readonly translator?: LogTranslator
}

export const generateAppId = (): string => `app${Date.now()}`;

/**
 * Factory method for Main application Logger.
 * Use `jamLogger` instance if you prefer out of box solution.
 *
 * @see `LoggerOptions` to customize.
 */
export const createLogger = (
  { appId, channels, tags, translator }: LoggerOptions = {}
): Logger => {
  const sortedTags = tags?.slice() ?? [];
  // eslint-disable-next-line functional/immutable-data
  sortedTags.sort();
  const id = appId ?? generateAppId();
  const logChannels = new LogOutputRegistry(channels ?? Logger.getDefaultChannels());
  return  {
    error: bakeLogWithLevel(LogLevel.Error, logChannels, sortedTags, id, translator),
    warn: bakeLogWithLevel(LogLevel.Warn, logChannels, sortedTags, id, translator),
    info: bakeLogWithLevel(LogLevel.Info, logChannels, sortedTags, id, translator),
    debug: bakeLogWithLevel(LogLevel.Debug, logChannels, sortedTags, id, translator),
    channels: logChannels,
    tags: sortedTags,
    tagged: (...newTags): Logger => createLogger( {
      appId,
      channels,
      tags: sortedTags.concat(newTags),
      translator
    }),
    appId: id
  };
}

/**
 * Ready made - Application Logger with:
 * - Console Output (same api)
 * - stacks for Error log Level
 * - auto-generated appId
 * - tags support
 * - fields sanitization by demand. (e.g. `jamLogger.info({ sanitize: ['sessionId'] }, 'Wow', someData)`)
 *
 * log example:
 *  `[app1611253982848][2021-01-21T18:33:02.981Z][debug][#client] Logged In, { username: Bob, password: '***' }`
 */
export const jamLogger = createLogger();