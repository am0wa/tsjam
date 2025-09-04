import type { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import type { Typeguard } from '../core';
import { replayLatest } from './rx-operators';

export type NotificationProvider<OutboundT> = {
  /**
   * Send one way Notification.
   * @param message - notification message
   */
  send: (notification: OutboundT) => void;
};

export type MessagingProvider<InboundT, OutboundT> = {
  readonly message$: Observable<InboundT>;
  /**
   * Send Request, pick corresponding Response.
   * @param message - outbound notification / request
   * @param responseMatcher - picks the corresponding response
   * @returns last response that replays for later subscriptions
   */
  send: <ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher?: Typeguard<ResponseT, InboundT>,
  ) => Observable<ResponseT>;
};

export type RPCFn<ResponseT, RequestT> = (request: RequestT) => Observable<ResponseT>;

/**
 * Single last response value that replays for later subscriptions.
 * Useful to return as single response in request call method.
 * @param source$ - stream of incoming messages
 * @param matcher - selector for the appropriate response
 */
export const replayLastMessage$ = <ResponseT extends SourceT, SourceT>(
  source$: Observable<SourceT>,
  matcher: Typeguard<ResponseT, SourceT>,
): Observable<ResponseT> => {
  return source$.pipe(filter(matcher), take(1), replayLatest(1));
};
