# net

Use `net` for low-level TCP and UDP clients/servers, DNS lookups, and IP/port utilities.

```osl
import "std:net"
```

## Example

```osl
import "std:net"

auto addrs = net.lookupHost("example.com")
log addrs
```

## API reference

### `net`

| Method | Returns | Notes |
| --- | --- | --- |
| `net.dial(network: any, address: any)` | `*TCPConn` |  |
| `net.listen(protocol: any, address: any)` | `*TCPConn` |  |
| `net.listenUDP(network: any, address: any)` | `*UDPConn` |  |
| `net.lookupHost(hostname: any)` | `array` | Returns the host's DNS addresses. |
| `net.lookupIP(hostname: any)` | `array` | Returns the host's IP addresses. |
| `net.lookupPort(service: any, network: any)` | `number` |  |
| `net.getAddressInfo(hostname: any)` | `object` | Returns address info. |

### `TCPConn` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.write(data: any)` | `boolean` | Converts the value to text and writes it. |
| `value.writeBytes(data: byte[])` | `boolean` | Writes bytes to the connection. |
| `value.read(bufferSize: any)` | `string` | Reads up to the bounded buffer size and returns text. |
| `value.readBytes(bufferSize: any)` | `byte[]` | Reads up to the bounded buffer size. |
| `value.close()` | `boolean` | Closes the resource. |
| `value.remoteAddr()` | `string` |  |
| `value.localAddr()` | `string` |  |
| `value.setTimeout(seconds: any)` | `boolean` | Sets a deadline while preserving fractional seconds. |

### `UDPConn` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.write(data: any, targetAddress: any)` | `boolean` |  |
| `value.read(bufferSize: any)` | `object` |  |
| `value.close()` | `boolean` | Closes the resource. |

## Notes

- Prefer `import "std:net"`; the older `import "osl/net"` spelling remains supported.

## Behavior and limits

Invalid ports or addresses return failure values. Timeouts can include fractional seconds. Closed
sockets, partial reads, and concurrent close, read, or write calls do not panic. Read buffers are
limited to 16 MiB.
