# net

> Low-level TCP/UDP sockets and DNS lookups

Use `net` for low-level TCP and UDP clients/servers, DNS lookups, and IP/port utilities.

```javascript
import "osl/net"
```

## Example

```javascript
import "osl/net"

auto addrs = net.lookupHost("example.com")
log addrs
```

## API reference

### `net`

| Method | Returns | Description |
| --- | --- | --- |
| `net.dial(network: any, address: any)` | `*TCPConn` | Runs the dial operation. |
| `net.listen(protocol: any, address: any)` | `*TCPConn` | Runs the listen operation. |
| `net.listenUDP(network: any, address: any)` | `*UDPConn` | Runs the listen udp operation. |
| `net.lookupHost(hostname: any)` | `array` | Runs the lookup host operation. |
| `net.lookupIP(hostname: any)` | `array` | Runs the lookup ip operation. |
| `net.lookupPort(service: any, network: any)` | `number` | Runs the lookup port operation. |
| `net.getAddressInfo(hostname: any)` | `object` | Returns address info. |

### `TCPConn` values

Methods available on `TCPConn` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.write(data: any)` | `boolean` | Runs the write operation. |
| `value.writeBytes(data: bytes)` | `boolean` | Writes bytes. |
| `value.read(bufferSize: any)` | `string` | Runs the read operation. |
| `value.readBytes(bufferSize: any)` | `bytes` | Reads bytes. |
| `value.close()` | `boolean` | Closes the resource. |
| `value.remoteAddr()` | `string` | Runs the remote addr operation. |
| `value.localAddr()` | `string` | Runs the local addr operation. |
| `value.setTimeout(seconds: any)` | `boolean` | Sets timeout. |

### `UDPConn` values

Methods available on `UDPConn` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.write(data: any, targetAddress: any)` | `boolean` | Runs the write operation. |
| `value.read(bufferSize: any)` | `object` | Runs the read operation. |
| `value.close()` | `boolean` | Closes the resource. |

## Notes

- Standard-library imports accept both `import "osl/net"` and `import "net"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
