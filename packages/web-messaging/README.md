# @tsjam/web-messaging

**Typescript reactive [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) Host**

For convenient and safe cross-origin communication between windows objects in iframes.

## Installation

```bash
npm install @tsjam/web-messaging
```

## Usage

```typescript
type Message = { name: string };
//...
const transport = PostMessageHost.bakeWithJSON<Message, Message>(window.parent, typeMatcheer, channelId);
//...
transport.message$.subscribe((message) => {
  console.log('Received message', message);
});
transport.send({ name: 'app2Wrapper.Exit' });
```
