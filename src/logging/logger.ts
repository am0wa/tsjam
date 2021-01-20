import { isSomething } from '../core';

import { ConsoleOutput } from './console.output';
import { LogLevel } from './level.enum';
import { LogOutputRegistry } from './output.registry';
import { LogContext, LogEntry, LogOutputChannel, LogTag } from './types';

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
    write(
      {
        date: new Date(),
        level,
        appId,
        context,
        message,
        data: args,
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

type LoggerOptions = {
  /** Application Id - to distinguish loggers of multiple instances of your Apps or services */
  readonly appId?: string,
  readonly channels?: readonly LogOutputChannel[],
  readonly tags?: readonly LogTag[]
}

export const createLogger = (
  { appId, channels, tags }: LoggerOptions = {}
): Logger => {
  const sortedTags = tags?.slice() ?? [];
  // eslint-disable-next-line functional/immutable-data
  sortedTags.sort();
  const id = appId ?? `app${Date.now()}`;
  const logChannels = new LogOutputRegistry(channels ?? Logger.getDefaultChannels());
  return  {
    error: bakeLogWithLevel(LogLevel.Error, logChannels, sortedTags, id),
    warn: bakeLogWithLevel(LogLevel.Warn, logChannels, sortedTags, id),
    info: bakeLogWithLevel(LogLevel.Info, logChannels, sortedTags, id),
    debug: bakeLogWithLevel(LogLevel.Debug, logChannels, sortedTags, id),
    channels: logChannels,
    tags: sortedTags,
    tagged: (...newTags): Logger => createLogger( {
      appId,
      channels,
      tags: sortedTags.concat(newTags)
    }),
    appId: id
  };
}

export const jamLogger = createLogger();