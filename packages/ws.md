# ws

Use `ws` for WebSocket clients and servers, connection callbacks, broadcast, and per-connection state.

```javascript
import "std:ws"
```

## API reference

### `ws`

| Method | Returns | Description |
| --- | --- | --- |
| `ws.Connect(url: string, ...protocols: string)` | `*wsConnection` | Opens a WebSocket client connection. |
| `ws.New(...args: string)` | `*wsServer` | Builds a server meant to be mounted on `serve` (`app.WS`, `c.upgrade`). No listen address. Optional: `New(path)` or `New(addr, path)`. Path defaults to `"/"`. |
| `ws.NewServer(addr: string, path: string)` | `*wsServer` | Builds a standalone server that can `Start`/`StartTLS` on `addr+path`, or still be mounted on serve like `New()`. |

### `wsConnection` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.Send(message: any)` | `void` | Runs the send operation. |
| `value.Close()` | `void` | Runs the close operation. |
| `value.EnableReconnect()` | `void` | Runs the enable reconnect operation. |
| `value.Connected()` | `boolean` | Reports whether the connection currently owns a live WebSocket session. Returns `false` during reconnect backoff and after close. |
| `value.Shutdown()` | `void` | Disables reconnect, cancels pending backoff, and closes the connection without allowing a replacement session. |
| `value.Set(key: string, value: any)` | `void` | Runs the set operation. |
| `value.Delete(key: string)` | `void` | Runs the delete operation. |
| `value.Get(key: string)` | `any` | Returns stored connection data. |
| `value.GetAll()` | `object` | Returns stored connection data. |
| `value.GetHeader(key: string)` | `string` | Returns stored connection data. |
| `value.GetHeaders()` | `object` | Returns stored connection data. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnClose(handler: function)` | `void` | Registers a callback for connection close. |

### `wsServer` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.OnConnect(handler: function)` | `void` | Registers a callback for new connections. |
| `value.OnMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.OnDisconnect(handler: function)` | `void` | Registers a callback for disconnected clients. |
| `value.AllowAllOrigins()` | `void` | Allows browser WebSocket upgrades from any origin. Call only for intentionally public cross-origin endpoints. |
| `value.Broadcast(message: string)` | `void` | Runs the broadcast operation. |
| `value.GetConnections()` | `array` | Returns connections. |
| `value.Start()` | `error` | Starts the standalone HTTP WebSocket server and blocks. |
| `value.StartTLS(certFile: string, keyFile: string)` | `error` | Starts the standalone HTTPS WebSocket server and blocks. |
| `value.HandleWebSocket()` | `http.HandlerFunc` | Runs the handle web socket operation. |
| `value.Stop()` | `error` | Runs the stop operation. |

## Mounting on serve

Prefer `ws.New()` when the HTTP server owns the listener:

```javascript
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

## Edge-case behavior

TLS uses normal certificate verification and servers enforce same-origin
upgrades by default. Call `AllowAllOrigins()` before mounting or starting a
server when it intentionally accepts browser clients from other origins. Upgrade
handshakes time out after 10 seconds.
Client and reconnect handshakes reuse one bounded dialer and the same requested
subprotocol headers. Callback panics share
one recovery boundary, connection iteration is shared by broadcast and shutdown,
and connection close uses one idempotent shutdown path. Queued byte messages are
copied so later caller mutations cannot alter data in flight.
Standalone servers reject overlapping `Start` or `StartTLS` calls. `Stop` makes
the active start call return `null`; listener failures still return their error.
Shutdown blocks upgrade registration before closing the listener, drains every
registered connection, and then permits a later start on the same server value.
