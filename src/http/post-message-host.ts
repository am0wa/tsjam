import { JSONParseSafely, ParseFn } from 'core';
import { mapFilterNotUndefined, MessagingProvider } from 'reactive';
import { fromEvent, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

export class PostMessageHost<InboundT = unknown, OutboundT = unknown>
  implements MessagingProvider<InboundT, OutboundT> {
  /** Stream of all messages from parent */
  readonly message$: Observable<InboundT>;

  send(message: OutboundT): void {
    this._target.postMessage(this._serializeFn(message), this._targetOrigin);
  }

  /**
   *
   * @param _target - `window` to which post message will be send
   * @param _targetOrigin - origin of window to which post message will be send
   * @param _serializeFn - serialize your outbound data
   * @param _deserializeFn - parse your inbound data
   */
  constructor(
    private readonly _target: Window,
    private readonly _targetOrigin: string = '*',
    private readonly _serializeFn: ParseFn<OutboundT, unknown> = JSON.stringify,
    private readonly _deserializeFn: ParseFn<unknown, InboundT> = JSONParseSafely,
  ) {
    this.message$ = createMessage$<OutboundT, InboundT>(window, _deserializeFn);
  }
}

export function createMessage$<T, U = unknown>(
  target: Window,
  parseFn: ParseFn<T, U>
): Observable<U> {
  return fromEvent<MessageEvent>(target, 'message').pipe(
    mapFilterNotUndefined(({ data }) => data ? parseFn(data) : undefined),
    share()
  );
}
