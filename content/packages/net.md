---
description: Open TCP and UDP sockets, listen for connections, and resolve host names.
package: net
---

# net

`std:net` is the low-level network layer: TCP connections, TCP listeners, UDP sockets and name lookups. Reach for it when you speak a protocol that isn't HTTP, such as a game server, a line-based text protocol or a custom binary format. For web requests use [requests](requests.md), for web servers use [serve](serve.md), and for URLs use [url](url.md).

Every example runs both ends in one program over the loopback address. Asking for port `0` lets the system pick a free one, and `localAddr()` tells you which.

## A TCP echo

`net.listen("tcp", address)` returns a listener. `listener.accept()` waits for one connection, so serve in an async function and connect from the main thread. `net.connect` opens the client side:

```osl
import "std:net"

auto listener = net.listen("tcp", "127.0.0.1:0").unwrap()
string address = listener.localAddr()

async serveOne() string (
  auto conn = listener.accept().unwrap()
  string data = conn.read(1024).unwrap()
  conn.write("echo: " ++ data).unwrap()
  conn.close().unwrap()
  return data
)
auto server = serveOne()

auto client = net.connect("tcp", address, {timeout: 2000}).unwrap()
client.write("hello").unwrap()
log client.read(1024).unwrap()
client.close().unwrap()

log "server saw" server.wait()
listener.close().unwrap()
```

```output
echo: hello
server saw hello
```

Change `"hello"` to something longer than 1024 characters, or shorter than one, and see how `read` behaves.

`read(maxBytes)` waits for data and returns up to that many bytes as text. It returns whatever has arrived, which may be less than the other side wrote in one go, because TCP is a stream and has no message boundaries. `write` sends all of its data or fails.

## Reading until the end

A peer that closes its side ends the stream, and the next `read` fails with a `StateError`. A loop that collects data until then reads a whole reply:

```osl
import "std:net"

auto listener = net.listen("tcp", "127.0.0.1:0").unwrap()

async serveOne() int (
  auto conn = listener.accept().unwrap()
  conn.write("first line\nsecond line\n").unwrap()
  conn.close().unwrap()
  return 1
)
auto server = serveOne()

auto client = net.connect("tcp", listener.localAddr()).unwrap()
string text = ""
while true (
  auto part = client.read(8)
  if part.isErr() break
  text = text ++ part.unwrap()
)
client.close().unwrap()
server.wait()
listener.close().unwrap()

log text.len
log text.trim().split("\n")
```

```output
23
["first line","second line"]
```

A protocol with several messages on one connection needs its own framing: a newline, a length prefix or a fixed size. Collect bytes and cut them at the boundaries.

## Timeouts

`connect`, `read` and `write` take a `timeout` option in milliseconds. A read that times out fails with a `TimeoutError`, and the connection stays usable:

```osl
import "std:net"

auto listener = net.listen("tcp", "127.0.0.1:0").unwrap()
auto client = net.connect("tcp", listener.localAddr()).unwrap()

auto quiet = client.read(10, {timeout: 100})
log quiet.isErr() quiet.unwrapErr().kind

client.close().unwrap()
listener.close().unwrap()
```

```output
true TimeoutError
```

Without a timeout, a read waits for as long as it takes. Closing a connection from another thread wakes a waiting read with an error, which is how you stop a reader.

## Connection errors

`net.connect` returns an error with a kind: `NetworkError` when the connection is refused, `NotFoundError` for a host name that doesn't exist and `TimeoutError` when it takes too long:

```osl
import "std:net"

auto refused = net.connect("tcp", "127.0.0.1:1", {timeout: 1000})
log refused.isErr() refused.unwrapErr().kind

switch net.connect("tcp", "127.0.0.1:1") (
  case ok(conn)
    log "connected to" conn.remoteAddr()
  case err(e)
    log "failed:" e.kind
)
```

```output
true NetworkError
failed: NetworkError
```

## UDP

UDP sends separate datagrams with no connection. Bind a socket with `net.listenUDP`, send with `write(data, address)` and receive with `read`, which gives `{data, addr}`:

```osl
import "std:net"

auto receiver = net.listenUDP("udp", "127.0.0.1:0").unwrap()
auto sender = net.listenUDP("udp", "127.0.0.1:0").unwrap()

sender.write("ping", receiver.localAddr()).unwrap()
auto packet = receiver.read(100).unwrap()
log packet.data
log packet.addr == sender.localAddr()

receiver.write("pong", packet.addr).unwrap()
log sender.read(100).unwrap().data

log receiver.read(100, {timeout: 100}).unwrapErr().kind

receiver.close().unwrap()
sender.close().unwrap()
```

```output
ping
true
pong
TimeoutError
```

Datagrams can be lost, duplicated or arrive out of order, and a datagram bigger than `maxBytes` is cut. Use UDP when losing one doesn't matter, and TCP when it does.

## Binary data

`read` and `write` work on text. For raw bytes, `readBytes(maxBytes)` returns `byte[]` and `write` also accepts `byte[]`:

```osl
import "std:net"

auto listener = net.listen("tcp", "127.0.0.1:0").unwrap()

async serveOne() int (
  auto conn = listener.accept().unwrap()
  byte[] data = conn.readBytes(16).unwrap()
  conn.write(data).unwrap()
  conn.close().unwrap()
  return data.len
)
auto server = serveOne()

auto client = net.connect("tcp", listener.localAddr()).unwrap()
byte[] payload = [1, 2, 3, 255]
client.write(payload).unwrap()
byte[] back = client.readBytes(16).unwrap()
int total = 0
for b in back (
  total = total + b
)
log back.len total
log "server read" server.wait() "bytes"

client.close().unwrap()
listener.close().unwrap()
```

```output
4 261
server read 4 bytes
```

## Looking up names

`net.lookupIP`, `net.lookupHost`, `net.lookupPort` and `net.addressInfo` ask the system's resolver. Names that are already addresses resolve to themselves, so these examples need no network:

```osl
import "std:net"

log net.lookupIP("127.0.0.1").unwrap()
log net.lookupPort("https", "tcp").unwrap()
log net.lookupPort("http", "tcp").unwrap()
log net.lookupHost("localhost").unwrap().len > 0
```

```output
["127.0.0.1"]
443
80
true
```

A name that doesn't resolve fails with a `NotFoundError`. A lookup waits on a real resolver, so expect it to take time and handle the failure.

:::quiz
You call `conn.read(1024)` and get 5 bytes, but the other side wrote a 20 byte message. Is that a bug?

- [ ] Yes, `read` should always return the whole message.
- [x] No. TCP is a stream with no message boundaries, so a read returns what has arrived so far.
- [ ] Yes, the connection dropped data.

Read in a loop, and mark where a message ends with a newline or a length.
:::

:::exercise title="Shout over UDP"
Send the text `hello` from `sender` to `receiver` and print what the receiver gets, upper-cased.

```osl
import "std:net"

auto receiver = net.listenUDP("udp", "127.0.0.1:0").unwrap()
auto sender = net.listenUDP("udp", "127.0.0.1:0").unwrap()

log "?"

receiver.close().unwrap()
sender.close().unwrap()
```

```output
HELLO
```

> [!hint]
> `sender.write("hello", receiver.localAddr()).unwrap()` sends a datagram.

> [!hint]
> `receiver.read(100).unwrap().data.toUpper()`.

```osl solution
import "std:net"

auto receiver = net.listenUDP("udp", "127.0.0.1:0").unwrap()
auto sender = net.listenUDP("udp", "127.0.0.1:0").unwrap()

sender.write("hello", receiver.localAddr()).unwrap()
log receiver.read(100).unwrap().data.toUpper()

receiver.close().unwrap()
sender.close().unwrap()
```

```output
HELLO
```
:::

## API reference

::api
