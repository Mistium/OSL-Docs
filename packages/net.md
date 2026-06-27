# net

> Low-level network utilities (TCP, UDP, DNS). Use osl/requests for HTTP and osl/url for URLs.

```javascript
import "osl/net"
```

## Methods

- `net.dial(network, address)` → `TCPConn`
- `net.listen(protocol, address)` → `TCPConn`
- `net.listenUDP(network, address)` → `UDPConn`
- `net.lookupHost(hostname)` → `array`
- `net.lookupIP(hostname)` → `array`
- `net.lookupPort(service, network)` → `number`
- `net.getAddressInfo(hostname)` → `object`

## Returned object: `TCPConn`

Returned by `net` methods; call these on the value you get back.

- `tCPConn.write(data)` → `boolean`
- `tCPConn.writeBytes(data)` → `boolean`
- `tCPConn.read(bufferSize)` → `string`
- `tCPConn.readBytes(bufferSize)` → `bytes`
- `tCPConn.close()` → `boolean`
- `tCPConn.remoteAddr()` → `string`
- `tCPConn.localAddr()` → `string`
- `tCPConn.setTimeout(seconds)` → `boolean`

## Returned object: `UDPConn`

Returned by `net` methods; call these on the value you get back.

- `uDPConn.write(data, targetAddress)` → `boolean`
- `uDPConn.read(bufferSize)` → `object`
- `uDPConn.close()` → `boolean`
