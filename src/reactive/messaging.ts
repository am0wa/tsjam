import { Observable } from 'rxjs';
import { filter, publishReplay, refCount, share, take } from 'rxjs/operators';

import { ParseFn, Typeguard } from '../core';

import { mapFilterNotUndefined } from './operators';

export type MessagingProvider<InboundT, OutboundT> = {
  readonly message$: Observable<InboundT>;
  /**
   * Send one way Notification.
   * @param message - notification message
   */
  send(message: OutboundT): void;
  /**
   * Send Request, pick corresponding Response.
   * @param message - outbound notification / request
   * @param responseMatcher - picks the corresponding response
   * @returns last response that replays for later subscriptions
   */
  send<ResponseT extends InboundT>(
    message: OutboundT,
    responseMatcher: Typeguard<ResponseT, InboundT>
  ): Observable<ResponseT>;
}

export type RPCFn<ResponseT, RequestT> = (request: RequestT) => Observable<ResponseT>;

/**
 * Single last response value that replays for later subscriptions
 * @param source$ - stream of incoming messages
 * @param matcher - selector for the appropriate response
 */
export const replayLastMessage$ = <ResponseT extends SourceT, SourceT>(
  source$: Observable<SourceT>,
  matcher: Typeguard<ResponseT, SourceT>
): Observable<ResponseT> => {
  return source$.pipe(
    filter(matcher),
    take(1),
    publishReplay(1),
    refCount()
  );
}

export function filterMessage$<T, U>(
  source$: Observable<T>,
  parser: ParseFn<T, U>
): Observable<U> {
  return source$.pipe(
    mapFilterNotUndefined<T, U>(parser),
    share()
  );
}
