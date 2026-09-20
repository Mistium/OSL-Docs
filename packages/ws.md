# ws

Use `ws` for WebSocket clients and servers, connection callbacks, broadcast, and per-connection state.

```osl
import "std:ws"
```

## API reference

### `ws`

| Method | Returns | Notes |
| --- | --- | --- |
| `ws.connect(url: string, ...protocols: string)` | `*ws.Connection` | Opens a WebSocket client connection. |
| `ws.new(...args: string)` | `*ws.Server` | Builds a server meant to be mounted on `serve` (`app.ws`, `c.upgrade`). No listen address. Optional: `new(path)` or `new(addr, path)`. Path defaults to `"/"`. |
| `ws.newServer(addr: string, path: string)` | `*ws.Server` | Builds a standalone server that can `start`/`startTLS` on `addr+path`, or still be mounted on serve like `new()`. |

### `*ws.Connection` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.send(message: any)` | `void` | Queues a message for delivery. |
| `value.close()` | `void` |  |
| `value.enableReconnect()` | `void` |  |
| `value.connected()` | `boolean` | Reports whether the connection currently owns a live WebSocket session. Returns `false` during reconnect backoff and after close. |
| `value.shutdown()` | `void` | Disables reconnect, cancels pending backoff, and closes the connection without allowing a replacement session. |
| `value.set(key: string, value: any)` | `void` |  |
| `value.delete(key: string)` | `void` |  |
| `value.get(key: string)` | `any` | Returns stored connection data. |
| `value.getAll()` | `object` | Returns stored connection data. |
| `value.getHeader(key: string)` | `string` | Returns stored connection data. |
| `value.getHeaders()` | `object` | Returns stored connection data. |
| `value.onMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.onClose(handler: function)` | `void` | Registers a callback for connection close. |

### `*ws.Server` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.onConnect(handler: function)` | `void` | Registers a callback for new connections. |
| `value.onMessage(handler: function)` | `void` | Registers a callback for incoming messages. |
| `value.onDisconnect(handler: function)` | `void` | Registers a callback for disconnected clients. |
| `value.allowAllOrigins()` | `void` | Allows browser WebSocket upgrades from any origin. Call only for intentionally public cross-origin endpoints. |
| `value.broadcast(message: string)` | `void` |  |
| `value.getConnections()` | `array` | Returns connections. |
| `value.start()` | `error` | Starts the standalone HTTP WebSocket server and blocks. |
| `value.startTLS(certFile: string, keyFile: string)` | `error` | Starts the standalone HTTPS WebSocket server and blocks. |
| `value.handleWebSocket()` | `http.HandlerFunc` |  |
| `value.stop()` | `error` |  |

## Mounting on serve

Prefer `ws.new()` when the HTTP server owns the listener:

```osl
import "std:serve"
import "std:ws"

auto socket = ws.new()
socket.onMessage(def(*ws.Connection conn, string msg) -> (
  conn.send("echo: " ++ msg)
))
*serve.Router app = serve.new()
app.ws("/ws", socket)
app.serve(":8080")
```

`ws.newServer(addr, path)` is for standalone servers that call `start()` themselves.

#### `ws.send(connection, message)` → `boolean`

Sends through an untyped connection value and returns `false` when the value is
not a connection, the connection is closed, the message is invalid, or its outbound queue is full.

#### `ws.closeConn(connection)` → `boolean`

Closes an untyped connection value safely. Repeated closes are harmless.

## Notes

- Prefer `import "std:ws"`; the older `import "osl/ws"` spelling remains supported.

## Behavior and limits

TLS uses normal certificate verification and servers enforce same-origin
upgrades by default. Call `allowAllOrigins()` before mounting or starting a
server when it intentionally accepts browser clients from other origins. Upgrade
handshakes time out after 10 seconds.
Client and reconnect handshakes use the same timeout and requested subprotocols. A panic in a
callback is recovered and logged with full OSL diagnostic information (error type, source file, line
number, and code frame). Closing a connection more than once is safe. The send queue copies byte
messages, so changing the caller's array later cannot change data already queued.
Standalone servers reject overlapping `start` or `startTLS` calls. `stop` makes
the active start call return `null`; listener failures still return their error.
Shutdown rejects new upgrades, closes the listener, and drains registered connections. The same
server value can be started again afterwards.

Standalone server `Start` and `Stop` return `null` on success or an error on failure.
Check their results with `== null` or `!= null`.
