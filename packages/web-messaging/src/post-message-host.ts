import { fromEvent, Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

import {
  isObject,
  isSomething,
  Json,
  MessagingProvider,
  optionalMap,
  ParseFn,
  replayLastMessage$,
  SafeJSON,
  Typeguard,
  unwrap,
} from 'tsjam';
import ownProperty = unwrap.ownProperty;

export const windowMessage$ = <T, U>(target: Window, parseFn: ParseFn<T, U>): Observable<U> => {
  return fromEvent<MessageEvent>(target, 'message').pipe(
    map(({ data }) => optionalMap(data, parseFn)),
    filter(isSomething),
    share(),
  );
};

export type PostMessageHostParams<InboundT, OutboundT, RawT> = Readonly<{
  /** Window to which post message will be sent */
  target: Window;
  /** Parse the unknown inbound messages */
  deserialize: ParseFn<RawT, InboundT>;
  /** Stringify the outbound messages */
  serialize: ParseFn<OutboundT, RawT>;
  /** Origin of window to which post message will be sent */
  targetOrigin?: string;
  /** Unique transport instance id to match messages related to this transport */
  rpcId?: string;
}>;

export type JsonPostMessageHostParams<InboundT> = {
  typeMatcher: ParseFn<Json, InboundT>;
  /** Window to which post message will be sent */
  target: Window;
  /** Origin of window to which post message will be sent */
  targetOrigin?: string;
  /** Unique transport instance id to match messages related to this transport */
  rpcId?: string;
};

/**
 * Define your Inbound and Outbound message Types and get the typed streams of message$
 */
export class PostMessageHost<InboundT, OutboundT, RawT> implements MessagingProvider<InboundT, OutboundT> {
  /** Stream of all messages from target */
  readonly message$: Observable<InboundT>;
  readonly #serialize: ParseFn<OutboundT, RawT>;

  /**
   * Creates JSON based PostMessage Host with JSON.parse / JSON.stringify under hood.
   * @param target - `window` to which post message will be sent
   * @param typeMatcher - deserialize the unknown inbound messages
   * @param targetOrigin - specifies what the origin from `targetWindow` must be for the event
   * @param rpcId - request/response matching id that guaranties their correspondence
   */
  static jsonHost<I, O>({
    target,
    typeMatcher,
    targetOrigin,
    rpcId,
  }: JsonPostMessageHostParams<I>): PostMessageHost<I, O, string> {
    return new PostMessageHost<I, O, string>({
      target,
      deserialize: (value) => optionalMap(SafeJSON.parse(value), typeMatcher),
      serialize: JSON.stringify,
      targetOrigin,
      rpcId,
    });
  }

  /** Unique transport instance id - used as rpcId to match messages */
  readonly id: string;
  readonly target: Window;
  readonly targetOrigin: string = '*';

  /**
   * Post Message Host constructor.
   * @param target - `window` to which post message will be sent
   * @param deserialize - parse the unknown inbound messages
   * @param serialize - stringify the outbound messages
   * @param targetOrigin - specifies what the origin from `targetWindow` must be for the event
   * @param rpcId - request/response matching id that guaranties their correspondence
   */
  constructor({
    target,
    deserialize,
    serialize,
    targetOrigin = '*',
    rpcId,
  }: PostMessageHostParams<InboundT, OutboundT, RawT>) {
    this.id = rpcId ?? `postman-${Date.now()}`;
    this.target = target;
    this.targetOrigin = targetOrigin;

    this.#serialize = serialize;
    this.message$ = windowMessage$(window, deserialize);
  }

  send(message: OutboundT): void;
  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher: Typeguard<ResponseT, InboundT>,
  ): Observable<ResponseT>;
  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher?: Typeguard<ResponseT, InboundT>,
  ): Observable<ResponseT> | undefined {
    this.target.postMessage(this.#serialize(message), this.targetOrigin);
    if (!isSomething(responseMatcher)) {
      return undefined;
    }

    const matcher = (response: InboundT): response is ResponseT => {
      const signature = this.id;
      const request = message; // literal name narrowing
      if (
        isObject(response) &&
        isObject(request) && // if objects check property
        ownProperty(response, signature) !== ownProperty(request, signature)
      ) {
        // if no property we pass through to the actual matcher
        return false; // not our response
      }
      return responseMatcher(response); // much by type now
    };

    return replayLastMessage$(this.message$, matcher);
  }
}
