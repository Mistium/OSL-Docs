# ws

> websocket package for osl

```javascript
import "osl/ws"
```

## Methods

- `ws.Connect(url, ...protocols)` → `wsConnection`
- `ws.NewServer(addr, path)` → `wsServer`

## Returned object: `wsHandlerState`

Returned by `ws` methods; call these on the value you get back.

- `wsHandlerState.message(c, msg)`
- `wsHandlerState.close(c)`
- `wsHandlerState.setMessage(fn)`
- `wsHandlerState.setClose(fn)`

## Returned object: `wsServer`

Returned by `ws` methods; call these on the value you get back.

- `wsServer.OnConnect(handler)`
- `wsServer.OnMessage(handler)`
- `wsServer.OnDisconnect(handler)`
- `wsServer.Broadcast(message)`
- `wsServer.GetConnections()` → `array`
- `wsServer.Start()` → `error`
- `wsServer.StartTLS(certFile, keyFile)` → `error`
- `wsServer.Stop()` → `error`

## Returned object: `wsConnection`

Returned by `ws` methods; call these on the value you get back.

- `wsConnection.Send(message)`
- `wsConnection.Close()`
- `wsConnection.EnableReconnect()`
- `wsConnection.Set(key, value)`
- `wsConnection.Delete(key)`
- `wsConnection.Get(key)` → `any`
- `wsConnection.GetAll()` → `object`
- `wsConnection.GetHeader(key)` → `string`
- `wsConnection.GetHeaders()` → `object`
- `wsConnection.OnMessage(handler)`
- `wsConnection.OnClose(handler)`
