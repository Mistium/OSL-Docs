# Networking

> **Legacy (originOS).** These string methods were the networking surface of
> originOS OSL, running in the browser/rotur environment. In the OSL CLI use the
> [`requests`](../../packages/requests.md), [`net`](../../packages/net.md) and
> [`ws`](../../packages/ws.md) packages instead. These pages are kept for reference.

The methods below are called on a URL string. Two families exist:

* **HTTP** - `.httpGet()` and `.http(method, data, headers)` block until the
  request finishes; `.getAsync()` returns `"Loading"` until the response arrives so
  the UI keeps running.
* **rotur** - `.roturConnect()` and `.roturSend(msg, target)` exchange packets over
  the rotur network.

See also [WebSockets](websockets/README.md) for persistent connections.
