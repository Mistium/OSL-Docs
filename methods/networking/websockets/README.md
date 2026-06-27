# Websockets

> **Legacy (originOS).** In the OSL CLI use the [`ws`](../../../packages/ws.md)
> package for WebSocket connections. These pages are kept for reference.

A WebSocket is opened by calling `.newWebsocket()` on a `ws://` or `wss://` URL,
which returns a connection id. The remaining methods are called on that id:

| Method | Purpose |
| --- | --- |
| `.newWebsocket()` | Open a connection, returns its id |
| `.wsOpen()` | Whether the connection is open |
| `.wsSend(msg)` | Send a message |
| `.wsHasnew()` | Whether unread messages are queued |
| `.wsGetcount()` | Number of queued messages |
| `.wsGetnext()` | Pop and return the next message |
| `.wsClose()` | Close the connection |

Incoming messages are polled each frame with `.wsHasnew()` / `.wsGetnext()` rather
than delivered through a callback.
