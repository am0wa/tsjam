import { EMPTY, fromEvent, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { isObject, isSomething, JSONParseSafely, ParseFn, Typeguard, unwrap } from '../core';
import { filterMessage$, mapFilterNotUndefined, MessagingProvider, replayLastMessage$ } from '../reactive';

import ownProperty = unwrap.ownProperty;

/**
 * Define your Inbound and Outbound message Types and get the typed streams of message$
 */
export class PostMessageHost<InboundT, OutboundT> implements MessagingProvider<InboundT, OutboundT> {
  /** Stream of all messages from target */
  readonly message$: Observable<InboundT>;

  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher?: Typeguard<ResponseT, InboundT>,
    targetOrigin = '*'): Observable<ResponseT> {
    this.target.postMessage(this._jsonSerializer(message), targetOrigin);
    if (!isSomething(responseMatcher)) {
      return EMPTY;
    }

    const matcher = (response: InboundT): response is ResponseT => {
      const request = message; // literal name narrowing
      if (
        isObject(response)
        && isObject(request) // if objects check property
        && ownProperty(response, this.rpcId) !== ownProperty(request, this.rpcId)
      ) {
        // if no property we pass through to the actual matcher
        return false; // not our response
      }
      return responseMatcher(response); // much by type now
    }

    return replayLastMessage$(this.message$, matcher);
  }


  /**
   * @param target - `window` to which post message will be send
   * @param messageParser - parse the unknown inbound messages
   * @param rpcId - request/response matching id that guaranties their correspondence
   * @param _jsonSerializer - serialize your outbound data into JSON
   * @param _jsonDeserializer - deserialize your inbound data from JSON
   */
  constructor(
    readonly target: Window,
    messageParser: ParseFn<unknown, InboundT>,
    readonly rpcId = 'id',
    private readonly _jsonSerializer: ParseFn<OutboundT, string> = JSON.stringify,
    private readonly _jsonDeserializer: ParseFn<string, InboundT> = JSONParseSafely,
  ) {
    this.message$ = filterMessage$(
      windowMessage$(window, _jsonDeserializer),
      messageParser
    );
  }
}

export function windowMessage$<T, U>(
  target: Window,
  parseFn: ParseFn<T, U>
): Observable<U> {
  return fromEvent<MessageEvent>(target, 'message').pipe(
    mapFilterNotUndefined(({ data }) => isSomething(data) ? parseFn(data) : undefined),
    share()
  );
}
