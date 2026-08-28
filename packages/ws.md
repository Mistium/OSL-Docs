# ws

Use `ws` for WebSocket clients and servers, connection callbacks, broadcast, and per-connection state.

```osl
import "std:ws"
```

## API reference

### `ws`

| Method | Returns | Notes |
| --- | --- | --- |
| `ws.Connect(url: string, ...protocols: string)` | `*wsConnection` | Opens a WebSocket client connection. |
| `ws.New(...args: string)` | `*wsServer` | Builds a server meant to be mounted on `serve` (`app.WS`, `c.upgrade`). No listen address. Optional: `New(path)` or `New(addr, path)`. Path defaults to `"/"`. |
| `ws.NewServer(addr: string, path: string)` | `*wsServer` | Builds a standalone server that can `Start`/`StartTLS` on `addr+path`, or still be mounted on serve like `New()`. |

### `wsConnection` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.Send(message: any)` | `void` |  |
| `value.Close()` | `void` |  |
| `value.EnableReconnect()` | `void` |  |
| `value.Connected()` | `boolean` | Reports whether the connection currently owns a live WebSocket session. Returns `false` during reconnect backoff and after close. |
| `value.Shutdown()` | `void` | Disables reconnect, cancels pending backoff, and closes the connection without allowing a replacement session. |
| `value.Set(key: string, value: any)` | `void` |  |
| `value.Delete(key: string)` | `void` |  |
| `value.Get(key: string)` | `any` | Returns stored connection data. |
| `value.GetAll()` | `object` | Returns stored connection data. |
| `value.GetHeader(key: string)` | `string` | Returns stored connection data. |
| `value.GetHeaders()` | `object` | Returns stored connection data. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnClose(handler: function)` | `void` | Registers a callback for connection close. |

### `wsServer` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.OnConnect(handler: function)` | `void` | Registers a callback for new connections. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnDisconnect(handler: function)` | `void` | Registers a callback for disconnected clients. |
| `value.AllowAllOrigins()` | `void` | Allows browser WebSocket upgrades from any origin. Call only for intentionally public cross-origin endpoints. |
| `value.Broadcast(message: string)` | `void` |  |
| `value.GetConnections()` | `array` | Returns connections. |
| `value.Start()` | `error` | Starts the standalone HTTP WebSocket server and blocks. |
| `value.StartTLS(certFile: string, keyFile: string)` | `error` | Starts the standalone HTTPS WebSocket server and blocks. |
| `value.HandleWebSocket()` | `http.HandlerFunc` |  |
| `value.Stop()` | `error` |  |

## Mounting on serve

Prefer `ws.New()` when the HTTP server owns the listener:

```osl
import "std:serve"
import "std:ws"

auto socket = ws.New()
socket.OnMessage(def(*ws.Connection conn, string msg) -> (
  conn.Send("echo: " ++ msg)
))
*serve.Router app = serve.new()
app.WS("/ws", socket)
app.serve(":8080")
```

`ws.NewServer(addr, path)` is for standalone servers that call `Start()` themselves.

#### `ws.send(connection, message)` → `boolean`

Sends through an untyped connection value and returns `false` when the value is
not a connection, the connection is closed, the message is invalid, or its outbound queue is full.

#### `ws.closeConn(connection)` → `boolean`

Closes an untyped connection value safely. Repeated closes are harmless.

## Notes

- Prefer `import "std:ws"`; the older `import "osl/ws"` spelling remains supported.

## Behavior and limits

TLS uses normal certificate verification and servers enforce same-origin
upgrades by default. Call `AllowAllOrigins()` before mounting or starting a
server when it intentionally accepts browser clients from other origins. Upgrade
handshakes time out after 10 seconds.
Client and reconnect handshakes use the same timeout and requested subprotocols. A panic in a
callback is recovered. Closing a connection more than once is safe. The send queue copies byte
messages, so changing the caller's array later cannot change data already queued.
Standalone servers reject overlapping `Start` or `StartTLS` calls. `Stop` makes
the active start call return `null`; listener failures still return their error.
Shutdown rejects new upgrades, closes the listener, and drains registered connections. The same
server value can be started again afterwards.
