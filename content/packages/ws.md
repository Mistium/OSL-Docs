---
description: Run WebSocket servers and connect to them as a client, sending text, binary and JSON messages in both directions.
package: ws
---

# ws

`std:ws` speaks WebSocket: a connection that stays open so either side can send a message at any time. Reach for it for chat, live dashboards, notifications and games, anywhere polling over plain HTTP would be wasteful. A server is usually mounted on a [serve](serve.md) router, and a client connects with `ws.connect`.

Every example below runs a server and a client in the one program on `127.0.0.1`. Messages arrive on another thread, so the examples collect them in a channel from [thread](thread.md) and read them in order.

## An echo server and a client

`ws.new()` makes a server. `server.on("message", fn)` registers a handler that receives the connection and the text. Mount the server on a route with `app.ws(path, server)`, then connect with `ws.connect`:

```osl
import "std:ws"
import "std:serve"
import "std:thread"

auto app = serve.new()
auto echo = ws.new()

echo.on("message", def(*ws.Connection conn, string message) (
  conn.send("echo: " ++ message).unwrap()
))
app.ws("/echo", echo)
app.start("127.0.0.1:8780").unwrap()

auto client = ws.connect("ws://127.0.0.1:8780/echo").unwrap()
auto inbox = thread.channel(8)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))

client.send("hello").unwrap()
log inbox.recv()
client.send("again").unwrap()
log inbox.recv()

client.close({wait: true})
app.stop().unwrap()
```

```output
echo: hello
echo: again
```

Send a third message, or an empty string, and run it again.

`send` returns a result because it can fail: the connection may be closed, or the peer too slow to read. `unwrap()` is fine in an example, and real code checks it. Handlers run on the connection's own thread, which is why the client hands what it receives to a channel. `inbox.recv()` waits until a message is there.

## Events

A server has three events: `connect` and `disconnect` call `fn(conn)`, and `message` calls `fn(conn, message)`. A client connection has `message`, `close`, and `open` (after a reconnect). Add as many handlers as you like. `off` removes one.

```osl
import "std:ws"
import "std:serve"
import "std:thread"

auto app = serve.new()
auto server = ws.new()
auto events = thread.channel(8)

server.on("connect", def(*ws.Connection conn) (
  events.send("connected").unwrap()
  conn.send("welcome").unwrap()
))
server.on("disconnect", def(*ws.Connection conn) (
  events.send("disconnected").unwrap()
))
app.ws("/", server)
app.start("127.0.0.1:8781").unwrap()

auto client = ws.connect("ws://127.0.0.1:8781/").unwrap()
auto inbox = thread.channel(8)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))
log events.recv()
log inbox.recv()
log client.isConnected()

client.close({wait: true})
log events.recv()
log client.isConnected()
app.stop().unwrap()
```

```output
connected
welcome
true
disconnected
false
```

The server calls the `connect` handlers before it delivers the connection's first message, so a handler there can set things up without racing the client.

## Messages: text, bytes and JSON

`send` picks the format from the value. A string goes as a text message, `byte[]` as a binary message, and an object or array is encoded as JSON text. On the receiving side every message arrives as a string, so parse JSON with [json](json.md):

```osl
import "std:ws"
import "std:serve"
import "std:json"
import "std:thread"

auto app = serve.new()
auto server = ws.new()

server.on("message", def(*ws.Connection conn, string message) (
  auto request = json.parse<object>(message).unwrap()
  conn.send({sum: request["a"] + request["b"], received: message.len}).unwrap()
))
app.ws("/add", server)
app.start("127.0.0.1:8782").unwrap()

auto client = ws.connect("ws://127.0.0.1:8782/add").unwrap()
auto inbox = thread.channel(4)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))

client.send({a: 2, b: 40}).unwrap()
log inbox.recv()

client.close({wait: true})
app.stop().unwrap()
```

```output
{"received":14,"sum":42}
```

Messages over 1 MiB are refused by default. Raise the limit with the `maxMessageBytes` option of `ws.new` and `ws.connect` when you need larger ones.

## Broadcast and rooms

`server.broadcast(message)` sends to every connected client. To send to a subset, tag connections with `conn.set(key, value)` and call `server.broadcastWhere(key, value, message)`. Here two clients join different rooms from a header, and a message reaches only the sender's room:

```osl
import "std:ws"
import "std:serve"
import "std:thread"

auto app = serve.new()
auto chat = ws.new()

chat.on("connect", def(*ws.Connection conn) (
  conn.set("room", conn.header("X-Room") ?? "lobby")
))
chat.on("message", def(*ws.Connection conn, string message) (
  string room = conn.get("room")
  chat.broadcastWhere("room", room, room ++ ": " ++ message)
))
app.ws("/chat", chat)
app.start("127.0.0.1:8783").unwrap()

auto red = ws.connect("ws://127.0.0.1:8783/chat", {headers: {"X-Room": "red"}}).unwrap()
auto blue = ws.connect("ws://127.0.0.1:8783/chat", {headers: {"X-Room": "blue"}}).unwrap()
auto redInbox = thread.channel(4)
auto blueInbox = thread.channel(4)
red.on("message", def(*ws.Connection conn, string message) (
  redInbox.send(message).unwrap()
))
blue.on("message", def(*ws.Connection conn, string message) (
  blueInbox.send(message).unwrap()
))

red.send("hello red").unwrap()
blue.send("hello blue").unwrap()
log redInbox.recv()
log blueInbox.recv()
log chat.connections().len

red.close({wait: true})
blue.close({wait: true})
app.stop().unwrap()
```

```output
red: hello red
blue: hello blue
2
```

`conn.header(name)` reads a header of the upgrade request, so the same trick carries a token or a user name. Browsers can't set custom headers on a WebSocket, so for those clients put the value in the URL and read it from the `serve` context in middleware instead.

## Serving on a path of your own

Without `serve`, a server can listen by itself. Give `ws.new` an address and path and call `run()`, which blocks until `stop()`, so run it in an async function:

```osl
import "std:ws"
import "std:thread"

auto server = ws.new({address: "127.0.0.1:8784", path: "/live"})
server.on("message", def(*ws.Connection conn, string message) (
  conn.send(message.toUpper()).unwrap()
))

async listen() result<unit, error> (
  return server.run()
)
auto running = listen()
thread.sleep(300)

auto client = ws.connect("ws://127.0.0.1:8784/live").unwrap()
auto inbox = thread.channel(4)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))
client.send("quiet please").unwrap()
log inbox.recv()

client.close({wait: true})
server.stop().unwrap()
log running.wait().isOk()
```

```output
QUIET PLEASE
true
```

Prefer mounting on `serve` when the program has other routes: one port, shared middleware and one place to stop.

## Closing

`conn.close()` returns at once and shuts the connection down in the background: queued messages go first, then a close message. Options set a `code` and `reason` the other side sees, and `wait: true` returns only when the socket is closed. After closing, `send` fails with a `StateError`:

```osl
import "std:ws"
import "std:serve"
import "std:thread"

auto app = serve.new()
auto server = ws.new()
server.on("message", def(*ws.Connection conn, string message) (
  conn.send("ok: " ++ message).unwrap()
  if message == "bye" (
    conn.close({code: 1000, reason: "finished"})
  )
))
app.ws("/", server)
app.start("127.0.0.1:8785").unwrap()

auto client = ws.connect("ws://127.0.0.1:8785/").unwrap()
auto inbox = thread.channel(8)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))
client.on("close", def(*ws.Connection conn) (
  inbox.send("closed").unwrap()
))

client.send("bye").unwrap()
log inbox.recv()
log inbox.recv()
log client.send("too late").unwrapErr().kind

app.stop().unwrap()
```

```output
ok: bye
closed
StateError
```

## Failing to connect

`ws.connect` returns a result. The error kind says what went wrong: `NetworkError` for a refused connection, `TimeoutError` when the handshake takes longer than the `timeout` option (10 seconds by default), `UnsupportedError` for a URL that isn't `ws://` or `wss://`, `ParseError` for a malformed URL and `NotFoundError` when the host doesn't exist:

```osl
import "std:ws"

auto refused = ws.connect("ws://127.0.0.1:1/nothing")
log refused.isErr() refused.unwrapErr().kind

auto wrong = ws.connect("http://example.com")
log wrong.unwrapErr().kind

switch ws.connect("ws://127.0.0.1:1/") (
  case ok(conn)
    log "connected"
  case err(e)
    log "could not connect:" e.kind
)
```

```output
true NetworkError
UnsupportedError
could not connect: NetworkError
```

## Reconnecting

A client connection can reopen itself after it drops. `conn.enableReconnect()` retries with a delay that doubles from one second to thirty, and fires `open` each time it succeeds. `conn.close()` stops it for good:

```osl norun
import "std:ws"

auto client = ws.connect("wss://example.com/feed").unwrap()
client.enableReconnect()
client.on("open", def(*ws.Connection conn) (
  log "reconnected, resubscribing"
  conn.send({subscribe: "prices"}).unwrap()
))
client.on("message", def(*ws.Connection conn, string message) (
  log message
))
```

After a reconnect the server sees a brand new connection, so anything it knew about the old one (rooms, a user name) has to be sent again from the `open` handler.

## Securing a server

A server accepts upgrades only from pages on its own origin unless you call `server.allowAllOrigins()`. Do that only for a public API. Because the upgrade is an ordinary HTTP request, middleware on the route applies to it, so `serve.requireBearer` or your own check can refuse a socket before it opens. For `wss://`, use `server.runTLS(certFile, keyFile)` or `app.runTLS(...)`, or put a proxy that terminates TLS in front.

:::quiz
A client handler runs on the connection's own thread. How does the example above pass the messages to the main program?

- [ ] It prints them from inside the handler.
- [x] It sends them into a channel, and the main thread calls `recv()`.
- [ ] `ws.connect` returns them in an array.

A channel hands values between threads safely and lets `recv()` wait until one arrives.
:::

:::exercise title="Shout service"
Make the server answer each message with the message upper-cased and its length, as JSON: `{"shout": "HI", "length": 2}`. The client part is written for you.

```osl
import "std:ws"
import "std:serve"
import "std:thread"

def reply(*thread.Channel inbox) string (
  for _ in 1 to 50 (
    auto m = inbox.tryRecv()
    if m != null return m
    thread.sleep(20)
  )
  return "(no reply)"
)

auto app = serve.new()
auto server = ws.new()

// handle messages here

app.ws("/shout", server)
app.start("127.0.0.1:8786").unwrap()

auto client = ws.connect("ws://127.0.0.1:8786/shout").unwrap()
auto inbox = thread.channel(4)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))
for word in ["hi", "osl"] (
  client.send(word).unwrap()
  log reply(inbox)
)

client.close({wait: true})
app.stop().unwrap()
```

```output
{"length":2,"shout":"HI"}
{"length":3,"shout":"OSL"}
```

> [!hint]
> Register `server.on("message", def(*ws.Connection conn, string message) ( ... ))` and call `conn.send` with an object.

> [!hint]
> `message.toUpper()` upper-cases text and `message.len` is its length.

```osl solution
import "std:ws"
import "std:serve"
import "std:thread"

def reply(*thread.Channel inbox) string (
  for _ in 1 to 50 (
    auto m = inbox.tryRecv()
    if m != null return m
    thread.sleep(20)
  )
  return "(no reply)"
)

auto app = serve.new()
auto server = ws.new()

server.on("message", def(*ws.Connection conn, string message) (
  conn.send({shout: message.toUpper(), length: message.len}).unwrap()
))

app.ws("/shout", server)
app.start("127.0.0.1:8854").unwrap()

auto client = ws.connect("ws://127.0.0.1:8854/shout").unwrap()
auto inbox = thread.channel(4)
client.on("message", def(*ws.Connection conn, string message) (
  inbox.send(message).unwrap()
))
for word in ["hi", "osl"] (
  client.send(word).unwrap()
  log reply(inbox)
)

client.close({wait: true})
app.stop().unwrap()
```

```output
{"length":2,"shout":"HI"}
{"length":3,"shout":"OSL"}
```
:::

:::exercise title="Visitor numbers"
Tell each client who it is. When a client connects, the server sends `you are visitor N`, counting from 1. Two clients connect, and each prints its greeting.

```osl
import "std:ws"
import "std:serve"
import "std:thread"

def firstMessage(*ws.Connection client) string (
  auto inbox = thread.channel(4)
  client.on("message", def(*ws.Connection conn, string message) (
    inbox.send(message).unwrap()
  ))
  for _ in 1 to 50 (
    auto m = inbox.tryRecv()
    if m != null return m
    thread.sleep(20)
  )
  return "(nothing)"
)

auto app = serve.new()
auto server = ws.new()

// count visitors on connect

app.ws("/", server)
app.start("127.0.0.1:8787").unwrap()

auto a = ws.connect("ws://127.0.0.1:8787/").unwrap()
log firstMessage(a)
auto b = ws.connect("ws://127.0.0.1:8787/").unwrap()
log firstMessage(b)

a.close({wait: true})
b.close({wait: true})
app.stop().unwrap()
```

```output
you are visitor 1
you are visitor 2
```

> [!hint]
> Keep `int visitors = 0` outside the handler and add one in `server.on("connect", ...)`.

> [!hint]
> `conn.send("you are visitor " ++ visitors).unwrap()`.

```osl solution
import "std:ws"
import "std:serve"
import "std:thread"

def firstMessage(*ws.Connection client) string (
  auto inbox = thread.channel(4)
  client.on("message", def(*ws.Connection conn, string message) (
    inbox.send(message).unwrap()
  ))
  for _ in 1 to 50 (
    auto m = inbox.tryRecv()
    if m != null return m
    thread.sleep(20)
  )
  return "(nothing)"
)

auto app = serve.new()
auto server = ws.new()
int visitors = 0

server.on("connect", def(*ws.Connection conn) (
  visitors = visitors + 1
  conn.send("you are visitor " ++ visitors).unwrap()
))

app.ws("/", server)
app.start("127.0.0.1:8855").unwrap()

auto a = ws.connect("ws://127.0.0.1:8855/").unwrap()
log firstMessage(a)
auto b = ws.connect("ws://127.0.0.1:8855/").unwrap()
log firstMessage(b)

a.close({wait: true})
b.close({wait: true})
app.stop().unwrap()
```

```output
you are visitor 1
you are visitor 2
```
:::

## API reference

::api
