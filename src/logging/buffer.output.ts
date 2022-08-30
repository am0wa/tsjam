import { ConsoleOutput } from './console.output';
import { LogEntry, LogOutput } from './types';

export class BufferOutput implements LogOutput {

  // eslint-disable-next-line functional/prefer-readonly-type
  readonly buffer: LogEntry[] = [];

  constructor(private readonly maxLogEntries = 200, private readonly flushOnOverload = false) {
  }

  write(entry: LogEntry): void {
    if (this.buffer.length >= this.maxLogEntries) {
      // eslint-disable-next-line functional/immutable-data
      this.flushOnOverload ? this.flush() : this.buffer.shift();
    }
    // eslint-disable-next-line functional/immutable-data
    this.buffer.push(entry)
  }

  flush(): void {
    // eslint-disable-next-line functional/immutable-data
    this.buffer.length = 0;
  }

  bufferToString(): string {
    return this.buffer
      .map((entry) => `${ConsoleOutput.formatMessage(entry)} ${JSON.stringify(entry.data)}`)
      .join('\\n');
  }
}