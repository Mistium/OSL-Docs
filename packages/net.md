# net

Use `net` for TCP, Unix and UDP sockets and DNS lookups. Use [requests](requests.md) for HTTP and
[url](url.md) for URLs.

```osl
import "std:net"
```

## Example

An echo server and a client in one program:

```osl
import "std:net"
import "std:thread"

*net.Listener listener = net.listen("tcp", "127.0.0.1:0")
string address = listener.localAddr()

auto server = thread.new(def() -> (
  *net.TCPConn peer = listener.accept()
  peer.write(peer.read(1024))
  peer.close()
))

*net.TCPConn client = net.connect("tcp", address)
client.write("ping")
log client.read(1024, {timeout: 2000})
server.wait()
client.close()
listener.close()
```

Reading until the peer hangs up:

```osl
import "std:net"

*net.TCPConn conn = net.connect("tcp", "example.com:80")
conn.write("HEAD / HTTP/1.0\r\nHost: example.com\r\n\r\n")
string reply = ""
while true (
  string chunk = conn.read(4096) catch (err) ( break )
  reply ++= chunk
)
log reply.split("\r\n")[1]
conn.close()
```

## API reference

### `net`

| Method | Returns | Notes |
| --- | --- | --- |
| `net.connect(network: string, address: string, options?)` | `result<*net.TCPConn, error>` | Opens a stream connection. `network` is `"tcp"`, `"tcp4"`, `"tcp6"` or `"unix"`; `address` is like `"example.com:80"` (a socket path for `"unix"`). Option: `timeout` (ms to wait for the connection, default 5000). |
| `net.listen(network: string, address: string)` | `result<*net.Listener, error>` | Accepts stream connections on `address`. Port 0 picks a free port; read it back with `localAddr()`. |
| `net.listenUDP(network: string, address: string)` | `result<*net.UDPConn, error>` | Binds a UDP socket. `network` is `"udp"`, `"udp4"` or `"udp6"`. |
| `net.lookupHost(hostname: string)` | `result<string[], error>` | The host's addresses, such as `"93.184.216.34"`. |
| `net.lookupIP(hostname: string)` | `result<string[], error>` | The host's IPv4 and IPv6 addresses. |
| `net.lookupPort(service: string, network: string)` | `result<int, error>` | Port number of a service name such as `"https"` on `"tcp"` or `"udp"`. A numeric service is returned as a number. |
| `net.addressInfo(hostname: string)` | `result<{hostname, hosts, ips}, error>` | The name asked for, its `lookupHost` addresses and its `lookupIP` addresses. |

### `*net.Listener`

| Method | Returns | Notes |
| --- | --- | --- |
| `listener.accept()` | `result<*net.TCPConn, error>` | Waits for the next connection. Fails with `StateError` when the listener is closed while waiting, which is how another thread stops an accept loop. |
| `listener.localAddr()` | `string` | The bound address, such as `"127.0.0.1:41234"`. |
| `listener.close()` | `result<unit, error>` | Stops accepting and wakes a waiting `accept()`. Closing twice is a no-op. |

### `*net.TCPConn`

| Method | Returns | Notes |
| --- | --- | --- |
| `conn.read(maxBytes: int, options?)` | `result<string, error>` | Waits for data and returns up to `maxBytes` bytes as text (capped at 16 MiB). Once the peer has closed the connection and everything it sent has been read, it fails with `StateError`. Option: `timeout` (ms; waits indefinitely by default). |
| `conn.readBytes(maxBytes: int, options?)` | `result<byte[], error>` | `read` returning `byte[]`. |
| `conn.write(data: string \| byte[], options?)` | `result<unit, error>` | Sends `data` in full. Option: `timeout` (ms). |
| `conn.remoteAddr()` | `string` | The peer's address. |
| `conn.localAddr()` | `string` | This end's address. |
| `conn.close()` | `result<unit, error>` | Closes the connection; a read waiting in another thread then fails with `StateError`. Closing twice is a no-op. |

### `*net.UDPConn`

| Method | Returns | Notes |
| --- | --- | --- |
| `udp.read(maxBytes: int, options?)` | `result<{data: string, addr: string}, error>` | Waits for the next datagram. `data` is truncated to `maxBytes`; `addr` is the sender. Option: `timeout` (ms). |
| `udp.readBytes(maxBytes: int, options?)` | `result<{data: byte[], addr: string}, error>` | `read` with the payload as `byte[]`. |
| `udp.write(data: string \| byte[], address: string)` | `result<unit, error>` | Sends `data` as one datagram to `address`. |
| `udp.localAddr()` | `string` | The bound address. |
| `udp.close()` | `result<unit, error>` | Closes the socket; a waiting read fails with `StateError`. Closing twice is a no-op. |

```osl
import "std:net"

*net.UDPConn a = net.listenUDP("udp", "127.0.0.1:0")
*net.UDPConn b = net.listenUDP("udp", "127.0.0.1:0")
a.write("hello", b.localAddr())
object packet = b.read(1024, {timeout: 2000})
log packet.data
a.close()
b.close()
```

### Errors

| Kind | When |
| --- | --- |
| `NetworkError` | Connection refused or unreachable, an address in use, a broken connection, or a failed send. |
| `NotFoundError` | The host doesn't resolve, or `lookupPort` gets an unknown service. |
| `TimeoutError` | A `timeout` passed or the resolver didn't answer. |
| `StateError` | End of stream on `read`/`readBytes`, or the handle was closed while waiting. Using a handle after `close()` throws `StateError`. |
| `ValueError` | A malformed address or unknown network. Thrown for `maxBytes` below 1. |
| `TypeError` (thrown) | `write` got something other than a string or `byte[]`. |

## Changes from earlier versions

`net.dial` and `net.getAddressInfo` are gone; use `net.connect` and `net.addressInfo`, which fail
with a typed error. `conn.writeBytes(data)` is now `conn.write(data)`, and `conn.setTimeout(seconds)`
is replaced by a `{timeout: ms}` option on `read` and `write`.
