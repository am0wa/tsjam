import { fromEvent, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { isObject, isSomething, Json, JSONParseSafely, optionalMap, ParseFn, Typeguard, unwrap } from '../core';
import { mapFilterNotUndefined, MessagingProvider, replayLastMessage$ } from '../reactive';

import ownProperty = unwrap.ownProperty;

export const windowMessage$ = <T, U>(
  target: Window,
  parseFn: ParseFn<T, U>
): Observable<U> => {
  return fromEvent<MessageEvent>(target, 'message').pipe(
    mapFilterNotUndefined(({ data }) => optionalMap(data, parseFn)),
    share()
  );
}

/**
 * Define your Inbound and Outbound message Types and get the typed streams of message$
 */
export class PostMessageHost<InboundT, OutboundT, RawT> implements MessagingProvider<InboundT, OutboundT> {
  /** Stream of all messages from target */
  readonly message$: Observable<InboundT>;
  readonly #serialize: ParseFn<OutboundT, RawT>;

  /**
   * Creates JSON based PostMessage Host with JSON.parse / JSON.stringify under hood.
   */
  static bakeWithJSON<I, O>(
    target: Window,
    typeMatcher: ParseFn<Json, I>,
    rpcId = 'id',
    targetOrigin = '*'
  ): PostMessageHost<I, O, string> {
    return new PostMessageHost<I, O, string>(
      target,
      (value) => optionalMap(JSONParseSafely(value), typeMatcher),
      JSON.stringify,
      rpcId,
      targetOrigin
    );
  }

  /**
   * @param target - `window` to which post message will be send
   * @param deserialize - parse the unknown inbound messages
   * @param serialize - stringify the outbound messages
   * @param rpcId - request/response matching id that guaranties their correspondence
   * @param targetOrigin - specifies what the origin from `targetWindow` must be for the event.
   */
  constructor(
    readonly target: Window,
    deserialize: ParseFn<RawT, InboundT>,
    serialize: ParseFn<OutboundT, RawT>,
    readonly rpcId = 'id',
    readonly targetOrigin = '*'
  ) {
    this.#serialize = serialize;
    this.message$ = windowMessage$(window, deserialize);
  }

  send(message: OutboundT): void;
  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher: Typeguard<ResponseT, InboundT>): Observable<ResponseT>
  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher?: Typeguard<ResponseT, InboundT>): Observable<ResponseT> | undefined{
    this.target.postMessage(this.#serialize(message), this.targetOrigin);
    if (!isSomething(responseMatcher)) {
      return undefined;
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
}
