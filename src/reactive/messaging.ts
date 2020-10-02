import { Observable } from 'rxjs';

export type MessagingProvider<InboundT, OutboundT> = {
  readonly message$: Observable<InboundT>;
  readonly send: (message: OutboundT) => void;
}

export type RPCMessagingProvider<InboundT, OutboundT> = {
  readonly message$: Observable<InboundT>;
  readonly send: MessageSender<InboundT, OutboundT>;
}

export type MessageSender<ResponseT, RequestT> = (request: RequestT) => Observable<ResponseT>;
