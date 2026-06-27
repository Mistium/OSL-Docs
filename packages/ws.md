# ws

> WebSocket client and server

Use `ws` for WebSocket clients and servers, connection callbacks, broadcast, and per-connection state.

```javascript
import "osl/ws"
```

## API reference

### `ws`

| Method | Returns | Description |
| --- | --- | --- |
| `ws.Connect(url: string, ...protocols: string)` | `*wsConnection` | Runs the connect operation. |
| `ws.NewServer(addr: string, path: string)` | `*wsServer` | Runs the new server operation. |

### `wsConnection` values

Methods available on `wsConnection` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.Send(message: any)` | `void` | Runs the send operation. |
| `value.Close()` | `void` | Runs the close operation. |
| `value.EnableReconnect()` | `void` | Runs the enable reconnect operation. |
| `value.Set(key: string, value: any)` | `void` | Runs the set operation. |
| `value.Delete(key: string)` | `void` | Runs the delete operation. |
| `value.Get(key: string)` | `any` | Returns stored connection data. |
| `value.GetAll()` | `object` | Returns stored connection data. |
| `value.GetHeader(key: string)` | `string` | Returns stored connection data. |
| `value.GetHeaders()` | `object` | Returns stored connection data. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnClose(handler: function)` | `void` | Registers a callback for connection close. |

### `wsServer` values

Methods available on `wsServer` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.OnConnect(handler: function)` | `void` | Registers a callback for new connections. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnDisconnect(handler: function)` | `void` | Registers a callback for disconnected clients. |
| `value.Broadcast(message: string)` | `void` | Runs the broadcast operation. |
| `value.GetConnections()` | `array` | Returns connections. |
| `value.Start()` | `error` | Runs the start operation. |
| `value.StartTLS(certFile: string, keyFile: string)` | `error` | Starts tls. |
| `value.HandleWebSocket()` | `http.HandlerFunc` | Runs the handle web socket operation. |
| `value.Stop()` | `error` | Runs the stop operation. |

## Notes

- Standard-library imports accept both `import "osl/ws"` and `import "ws"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
