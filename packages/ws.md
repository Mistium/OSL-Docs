# ws

Use `ws` to run WebSocket servers and open WebSocket client connections that exchange text, binary
and JSON messages.

```osl
import "std:ws"
```

## Example

A server mounted on a [serve](serve.md) router, and a client talking to it:

```osl
import "std:serve"
import "std:ws"
import "std:thread"

*ws.Server socket = ws.new()
socket.on("message", def(*ws.Connection conn, string msg) -> (
  conn.send("echo: " ++ msg)
))

*serve.Router app = serve.new()
app.ws("/chat", socket)
_ = thread.new(def() -> (
  app.run(":8080")
))
wait 0.5

*ws.Connection client = ws.connect("ws://localhost:8080/chat")
client.on("message", def(*ws.Connection conn, string msg) -> (
  log msg
))
client.send("hi")
client.send({type: "join", room: "lobby"})
wait 0.5
client.close()
app.stop()
```

A standalone server that owns its own listener:

```osl
import "std:ws"

*ws.Server server = ws.new({address: ":9000", path: "/ws"})
server.on("connect", def(*ws.Connection conn) -> (
  conn.set("name", conn.header("X-User") ?? "guest")
))
server.on("message", def(*ws.Connection conn, string msg) -> (
  server.broadcast(conn.get("name") ++ ": " ++ msg)
))
server.run()
```

## API reference

### `ws`

| Method | Returns | Notes |
| --- | --- | --- |
| `ws.connect(url: string, options?)` | `result<*ws.Connection, error>` | Opens a client connection to a `ws://` or `wss://` URL and starts receiving messages. Options: `protocols` (array of subprotocol names to offer), `headers` (object of extra handshake headers), `timeout` (ms for the handshake, default 10000). |
| `ws.new(options?)` | `*ws.Server` | A server. Mount it on a router with `app.ws(path, server)` (or `c.upgrade(server)`), or run it standalone with `server.run()`. Standalone options: `address` (default `":8080"`), `path` (default `"/"`). |

`ws.connect` fails with `ParseError` for a malformed URL, `UnsupportedError` for another scheme,
`NotFoundError` when the host doesn't resolve, `TimeoutError` when the handshake takes too long and
`NetworkError` when the connection is refused or the server doesn't accept the upgrade.

### `*ws.Server`

| Method | Returns | Notes |
| --- | --- | --- |
| `server.on(event: string, fn)` | `void` | Adds a handler. `"connect"` and `"disconnect"` call `fn(conn)`; `"message"` calls `fn(conn, message)` for every message from any client. Throws `ValueError` for an unknown event. |
| `server.off(event: string, fn)` | `boolean` | Removes a handler added with `on`; reports whether it was registered. |
| `server.allowAllOrigins()` | `void` | Accepts upgrades from pages on any origin. By default only same-origin browser pages may connect. |
| `server.broadcast(message)` | `void` | Sends to every connected client, skipping closed connections and full send queues. |
| `server.broadcastWhere(key: string, value, message)` | `void` | Sends to every client whose stored value for `key` (see `conn.set`) equals `value`. |
| `server.connections()` | `*ws.Connection[]` | The connected clients. |
| `server.run()` | `result<unit, error>` | Serves upgrades on the server's address and path and blocks until `stop()`. Fails with `NetworkError` when the address can't be bound; throws `StateError` when already running. |
| `server.runTLS(certFile: string, keyFile: string)` | `result<unit, error>` | `run` over TLS (`wss://`) with PEM certificate and key files. Fails with `NotFoundError` or `IOError` when they can't be read. |
| `server.stop()` | `result<unit, error>` | Closes the server and every connection, firing `"disconnect"` for each. A waiting `run()` then returns. |

### `*ws.Connection`

| Method | Returns | Notes |
| --- | --- | --- |
| `conn.send(message)` | `result<unit, error>` | Queues a message. Fails with `StateError` when the connection is closed and `IOError` when the send queue is full because the peer isn't reading. |
| `conn.on(event: string, fn)` | `void` | Adds a handler. `"message"` calls `fn(conn, message)` (binary messages arrive as strings); `"close"` calls `fn(conn)` when the connection closes from either side; `"open"` calls `fn(conn)` after a reconnect. Throws `ValueError` for an unknown event. |
| `conn.off(event: string, fn)` | `boolean` | Removes a handler; reports whether it was registered. |
| `conn.close()` | `void` | Closes for good, sending a close message and firing `"close"`. Also cancels reconnecting. Closing twice is a no-op. |
| `conn.enableReconnect()` | `void` | Makes a client connection reopen itself after it drops, with a delay doubling from 1 s up to 30 s, firing `"open"` each time. |
| `conn.isConnected()` | `boolean` | Whether the connection is open right now. |
| `conn.set(key: string, value)` | `void` | Stores a value for the program's own bookkeeping (a user name, a room). `broadcastWhere` matches on it. |
| `conn.get(key: string)` | `any` | The stored value, or `null`. |
| `conn.delete(key: string)` | `void` | Removes a stored value. |
| `conn.data()` | `object` | Every stored value, as a new object. |
| `conn.header(name: string)` | `string?` | A header of the upgrade request that opened a server-side connection, matched case-insensitively, or `null`. `"Remote-Addr"` holds the client's address. |
| `conn.headers()` | `string[string]` | The upgrade request's headers (first value of each); empty for client connections. |

### Messages

`send`, `broadcast` and `broadcastWhere` take a string (sent as a text message), a `byte[]` (a
binary message) or an object or array (JSON text). Other types throw `TypeError`.

Handlers run on the connection's own thread. A handler that throws has its error printed, and the
server or connection keeps running.

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `ws.connect(url, "proto1", "proto2")` | `ws.connect(url, {protocols: ["proto1", "proto2"]})` |
| `ws.new(address, path)`, `ws.new(address)`, `ws.new("/path")` | `ws.new({address, path})` |
| `ws.newServer(address, path)` | `ws.new({address, path})` |
| `ws.send(conn, message)` (returned `false` on failure) | `conn.send(message)` |
| `ws.closeConn(conn)` | `conn.close()` |
| `server.onConnect(fn)`, `server.onMessage(fn)`, `server.onDisconnect(fn)` (replaced the handler) | `server.on("connect" \| "message" \| "disconnect", fn)`, which adds one |
| `server.getConnections()` | `server.connections()` |
| `server.start()` | `server.run()` |
| `server.startTLS(certFile, keyFile)` | `server.runTLS(certFile, keyFile)` |
| `conn.onMessage(fn)`, `conn.onClose(fn)` | `conn.on("message" \| "close", fn)` |
| `conn.connected()` | `conn.isConnected()` |
| `conn.shutdown()` | `conn.close()`, which now also cancels reconnecting |
| `conn.getAll()` | `conn.data()` |
| `conn.getHeader(name)` (returned `""` when missing) | `conn.header(name)`, which returns `null` |
| `conn.getHeaders()` | `conn.headers()` |
