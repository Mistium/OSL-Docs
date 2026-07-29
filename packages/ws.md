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
| `ws.Connect(url: string, ...protocols: string)` | `*wsConnection` | Opens a WebSocket client connection. |
| `ws.New(...args: string)` | `*wsServer` | Builds a server meant to be mounted on `serve` (`app.WS`, `c.upgrade`). No listen address. Optional: `New(path)` or `New(addr, path)`. Path defaults to `"/"`. |
| `ws.NewServer(addr: string, path: string)` | `*wsServer` | Builds a standalone server that can `Start`/`StartTLS` on `addr+path`, or still be mounted on serve like `New()`. |

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
| `value.AllowAllOrigins()` | `void` | Allows browser WebSocket upgrades from any origin. Call only for intentionally public cross-origin endpoints. |
| `value.Broadcast(message: string)` | `void` | Runs the broadcast operation. |
| `value.GetConnections()` | `array` | Returns connections. |
| `value.Start()` | `error` | Runs the start operation. |
| `value.StartTLS(certFile: string, keyFile: string)` | `error` | Starts tls. |
| `value.HandleWebSocket()` | `http.HandlerFunc` | Runs the handle web socket operation. |
| `value.Stop()` | `error` | Runs the stop operation. |

## Mounting on serve

Prefer `ws.New()` when the HTTP server owns the listener:

```javascript
import "osl/serve"
import "osl/ws"

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

Sends through an untyped connection value and returns `false` for a closed or
non-connection value.

#### `ws.closeConn(connection)` → `boolean`

Closes an untyped connection value safely. Repeated closes are harmless.

## Notes

- Standard-library imports accept both `import "osl/ws"` and `import "ws"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

TLS uses normal certificate verification and servers enforce same-origin
upgrades by default. Call `AllowAllOrigins()` before mounting or starting a
server when it intentionally accepts browser clients from other origins.
Callback panics are contained, close/stop are idempotent, and shutdown closes
active and mounted connections.
