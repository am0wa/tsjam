import { LogLevel } from './level.enum';
import { contextLine, stringNode } from './log.utils';
import { LogEntry, LogOutput } from './types';

export class ConsoleOutput implements LogOutput {
  private readonly logMethods = {
    [LogLevel.Debug]: console.debug.bind(console),
    [LogLevel.Info]: console.info.bind(console),
    [LogLevel.Warn]: console.warn.bind(console),
    [LogLevel.Error]: console.error.bind(console),
  };

  write({ date, appId, level, context, message, data, stack }: LogEntry): void {
    const restData = data ?? [];
    this.logMethods[level](
      `${stringNode(appId)}${stringNode(date.toISOString())}${stringNode(level)}${contextLine(context)} ${message} ${stack ?? ''}`,
      ...restData
    );
  }
}