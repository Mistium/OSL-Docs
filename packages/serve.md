# serve

> HTTP server / web framework

`serve` is OSL's web framework. It gives you a router, request/response **contexts**, middleware, route
groups, static-file serving, WebSockets and TLS.

```javascript
import "osl/serve"
```

## Quick start

```javascript
import "osl/serve"

*serve.Router app = serve.new()

app.GET("/", def(*serve.Context c) -> (
  c.string(200, "Hello, World!")
))

app.GET("/ping", def(*serve.Context c) -> (
  c.json(200, { message: "pong" })
))

log "Listening on http://localhost:8080"
app.serve(":8080")
```

A **handler** is a function that takes a `*serve.Context` and writes a response. Create the router
with `serve.new()`, register routes, then call `serve(addr)` to start listening (this blocks).

## Routing

Register a handler for each HTTP method:

```javascript
app.GET("/users", listUsers)
app.POST("/users", createUser)
app.PUT("/users/:id", replaceUser)
app.PATCH("/users/:id", updateUser)
app.DELETE("/users/:id", deleteUser)
app.ANY("/health", healthCheck)     // any method
```

### Route parameters

Use `:name` in a pattern and read it with `c.param(...)`:

```javascript
app.GET("/users/:id", def(*serve.Context c) -> (
  string id = c.param("id")
  c.json(200, { id: id })
))
```

## The Context

The `*serve.Context` (named `c` by convention) is how you read the request and write the response.

### Reading the request

```javascript
c.method()                 // "GET", "POST", …
c.path()                   // "/users/42"
c.param("id")              // a route parameter
c.query("q")               // ?q=...   (queryDefault, queryInt, queryBool also exist)
c.header("X-Token")        // a request header
c.bearer()                 // the Bearer token from Authorization
c.body()                   // raw body as a string
c.bodyJSON()               // body parsed as an object
c.cookie("session")        // a cookie value
c.formValue("email")       // a form field
```

### Writing the response

```javascript
c.string(200, "plain text")
c.json(200, { ok: true })
c.html(200, "<h1>Hi</h1>")
c.data(200, "image/png", bytes)
c.redirect(302, "/login")
c.noContent()                          // 204
c.file("./public/report.pdf")          // send a file
c.attachment("./r.pdf", "report.pdf")  // force download

// Convenience helpers
c.ok({ data: 1 })                      // 200
c.created({ id: 5 })                   // 201
c.badRequest("missing field")          // 400
c.unauthorized("login required")       // 401
c.notFound("no such user")             // 404
c.internalError("oops")                // 500

// Cookies and headers
c.setHeader("X-App", "osl")
c.setCookie("session", token, 3600, "/", "", true, true)
```

### Per-request values

Middleware and handlers can stash values on the context:

```javascript
c.set("userId", 42)
int id = c.getInt("userId")
```

## Middleware

Middleware are handlers that run before your route handler. Register them with `use(...)`; call
`c.next()` to continue or one of the response helpers to stop. The framework ships ready-made
middleware:

```javascript
app.use(serve.logger())
app.use(serve.cors("*", "GET,POST", "Content-Type"))
app.use(serve.recover())               // recover from panics → 500
app.use(serve.rateLimit(100, 60))      // 100 requests per 60s
app.use(serve.requireBearer("secret")) // require a Bearer token
app.use(serve.secureHeaders())
app.use(serve.requestID())
```

Other built-in middleware: `corsOpen()`, `requireHeader(key, value)`, `maxBodySize(bytes)`,
`timeout(seconds)`, `basicAuth(user, pass)`, `noCache()`, `setKey(key, value)`.

Writing your own is just a handler:

```javascript
def auth(*serve.Context c) -> (
  if c.bearer() == "" (
    c.unauthorized("no token")
  ) else (
    c.next()
  )
)

app.use(auth)
```

## Route groups

Group related routes under a shared prefix (and shared middleware):

```javascript
*serve.Router api = app.group("/api")
api.use(serve.requireBearer("secret"))
api.GET("/users", listUsers)
api.GET("/posts", listPosts)
```

## Static files

```javascript
app.static("/assets", "./public")           // serve a directory
app.staticFile("/favicon.ico", "./fav.ico") // serve a single file
```

## WebSockets

Attach a [`ws`](ws.md) server to a route:

```javascript
import "osl/serve"
import "osl/ws"

*serve.Router app = serve.new()
*ws.Server chat = ws.NewServer(":8080", "/chat")

chat.OnMessage(def(*ws.Connection conn, string msg) -> (
  conn.Send("echo: " ++ msg)
))

app.WS("/chat", chat)
app.serve(":8080")
```

## HTTPS / TLS

```javascript
app.serveTLS(":443", "cert.pem", "key.pem")
```

## Method reference

### Router (`serve.new()` → `*serve.Router`)

- `app.GET(pattern, ...handlers)` · `POST` · `PUT` · `PATCH` · `DELETE` · `OPTIONS` · `HEAD` · `ANY`
- `app.WS(pattern, wsServer)`
- `app.use(...handlers)` → `*serve.Router`
- `app.group(prefix, fn?)` → `*serve.Router`
- `app.static(prefix, dir)` · `app.staticFile(pattern, filepath)`
- `app.serve(addr)` - start the server (blocks)
- `app.serveTLS(addr, certFile, keyFile)`
- `app.handler()` → the underlying HTTP handler

### Middleware factories (on `serve`)

`logger()`, `cors(allowOrigin, allowMethods, allowHeaders)`, `corsOpen()`, `rateLimit(max, windowSeconds)`,
`requireBearer(token)`, `requireHeader(key, value)`, `maxBodySize(bytes)`, `recover()`, `timeout(seconds)`,
`setKey(key, value)`, `basicAuth(user, pass)`, `requestID()`, `secureHeaders()`, `noCache()`.

### Context (`*serve.Context`)

**Read:** `method()`, `path()`, `host()`, `ip()`, `param(k)`, `query(k)`, `queryDefault(k, d)`,
`queryInt(k, d)`, `queryBool(k, d)`, `queryArray(k)`, `header(k)`, `bearer()`, `body()`, `bodyBytes()`,
`bodyJSON()`, `bodyJSONArray()`, `formValue(k)`, `formFile(k)`, `cookie(k)`, `cookies()`, `userAgent()`,
`referer()`, `isJSON()`, `isForm()`, `isWebSocket()`, `isAjax()`, `contentType()`, `fullURL()`.

**Write:** `status(code)`, `string(code, text)`, `json(code, obj)`, `html(code, body)`, `text(code, body)`,
`data(code, contentType, bytes)`, `redirect(code, url)`, `noContent()`, `ok(obj)`, `created(obj)`,
`badRequest(msg)`, `unauthorized(msg)`, `forbidden(msg)`, `notFound(msg)`, `internalError(msg)`,
`file(path)`, `attachment(path, name)`, `setHeader(k, v)`, `addHeader(k, v)`, `setCookie(...)`,
`clearCookie(name)`.

**Flow & state:** `next()`, `abort(...)`, `isAborted()`, `set(k, v)`, `get(k)`, `getString(k)`,
`getInt(k)`, `getBool(k)`, `getFloat(k)`.

## Complete API reference

### `serve`

| Method | Returns | Description |
| --- | --- | --- |
| `serve.new()` | `*serveRouter` | Creates a new value. |
| `serve.New()` | `*serveRouter` | Runs the new operation. |
| `serve.logger()` | `serveHandler` | Runs the logger operation. |
| `serve.cors(allowOrigin: string, allowMethods: string, allowHeaders: string)` | `serveHandler` | Runs the cors operation. |
| `serve.corsOpen()` | `serveHandler` | Runs the cors open operation. |
| `serve.rateLimit(maxRequests: number, windowSeconds: number)` | `serveHandler` | Runs the rate limit operation. |
| `serve.requireBearer(token: string)` | `serveHandler` | Runs the require bearer operation. |
| `serve.requireHeader(key: string, value: string)` | `serveHandler` | Runs the require header operation. |
| `serve.maxBodySize(maxBytes: number)` | `serveHandler` | Runs the max body size operation. |
| `serve.recover()` | `serveHandler` | Runs the recover operation. |
| `serve.timeout(seconds: number)` | `serveHandler` | Runs the timeout operation. |
| `serve.setKey(key: string, value: any)` | `serveHandler` | Sets key. |
| `serve.basicAuth(username: string, password: string)` | `serveHandler` | Runs the basic auth operation. |
| `serve.requestID()` | `serveHandler` | Runs the request id operation. |
| `serve.secureHeaders()` | `serveHandler` | Runs the secure headers operation. |
| `serve.noCache()` | `serveHandler` | Runs the no cache operation. |

### `serveContext` values

Methods available on `serveContext` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.status(code: number)` | `void` | Runs the status operation. |
| `value.string(code: number, format: string, ...values: any)` | `void` | Runs the string operation. |
| `value.json(code: number, obj: any)` | `void` | Runs the json operation. |
| `value.html(code: number, body: string, ...data: any)` | `void` | Runs the html operation. |
| `value.HTML(code: number, name: string, data: any)` | `void` | Runs the html operation. |
| `value.data(code: number, contentType: string, body: bytes)` | `void` | Runs the data operation. |
| `value.redirect(code: number, url: string)` | `void` | Runs the redirect operation. |
| `value.noContent()` | `void` | Runs the no content operation. |
| `value.ok(obj: any)` | `void` | Runs the ok operation. |
| `value.created(obj: any)` | `void` | Runs the created operation. |
| `value.next()` | `void` | Runs the next operation. |
| `value.abort(...values: any)` | `void` | Runs the abort operation. |
| `value.isAborted()` | `boolean` | Reports whether aborted. |
| `value.badRequest(message: string)` | `void` | Runs the bad request operation. |
| `value.unauthorized(message: string)` | `void` | Runs the unauthorized operation. |
| `value.forbidden(message: string)` | `void` | Runs the forbidden operation. |
| `value.notFound(message: string)` | `void` | Runs the not found operation. |
| `value.internalError(message: string)` | `void` | Runs the internal error operation. |
| `value.flush()` | `void` | Runs the flush operation. |
| `value.method()` | `string` | Runs the method operation. |
| `value.path()` | `string` | Runs the path operation. |
| `value.host()` | `string` | Runs the host operation. |
| `value.remoteAddr()` | `string` | Runs the remote addr operation. |
| `value.ip()` | `string` | Runs the ip operation. |
| `value.isWebSocket()` | `boolean` | Reports whether web socket. |
| `value.contentType()` | `string` | Runs the content type operation. |
| `value.isJSON()` | `boolean` | Reports whether json. |
| `value.isForm()` | `boolean` | Reports whether form. |
| `value.query(key: string)` | `string` | Runs the query operation. |
| `value.queryDefault(key: string, def: string)` | `string` | Runs the query default operation. |
| `value.queryInt(key: string, def: number)` | `number` | Runs the query int operation. |
| `value.queryBool(key: string, def: boolean)` | `boolean` | Runs the query bool operation. |
| `value.queryAll()` | `object` | Runs the query all operation. |
| `value.param(key: string)` | `string` | Runs the param operation. |
| `value.paramInt(key: string, def: number)` | `number` | Runs the param int operation. |
| `value.header(key: string)` | `string` | Runs the header operation. |
| `value.hasHeader(key: string, value: string)` | `boolean` | Reports whether header. |
| `value.setHeader(key: string, value: string)` | `void` | Sets header. |
| `value.addHeader(key: string, value: string)` | `void` | Adds header. |
| `value.bearer()` | `string` | Runs the bearer operation. |
| `value.body()` | `string` | Runs the body operation. |
| `value.bodyBytes()` | `bytes` | Runs the body bytes operation. |
| `value.bodyJSON()` | `object` | Runs the body json operation. |
| `value.bodyJSONArray()` | `array` | Runs the body jsonarray operation. |
| `value.bindJSON(out: any)` | `error` | Runs the bind json operation. |
| `value.formValue(key: string)` | `string` | Runs the form value operation. |
| `value.formValueDefault(key: string, def: string)` | `string` | Runs the form value default operation. |
| `value.formFile(key: string)` | `*Result` | Runs the form file operation. |
| `value.cookie(name: string)` | `string` | Runs the cookie operation. |
| `value.setCookie(name: string, value: string, maxAge: number, path: string, domain: string, secure: boolean, httpOnly: boolean)` | `void` | Sets cookie. |
| `value.clearCookie(name: string)` | `void` | Runs the clear cookie operation. |
| `value.set(key: string, value: any)` | `void` | Sets a value. |
| `value.get(key: string)` | `any` | Returns a value. |
| `value.getString(key: string)` | `string` | Returns string. |
| `value.getBool(key: string)` | `boolean` | Returns bool. |
| `value.getInt(key: string)` | `number` | Returns int. |
| `value.written()` | `boolean` | Runs the written operation. |
| `value.text(code: number, body: string)` | `void` | Runs the text operation. |
| `value.file(filepath: string)` | `void` | Runs the file operation. |
| `value.attachment(filepath: string, filename: string)` | `void` | Runs the attachment operation. |
| `value.queryArray(key: string)` | `array` | Runs the query array operation. |
| `value.cookies()` | `object` | Runs the cookies operation. |
| `value.userAgent()` | `string` | Runs the user agent operation. |
| `value.referer()` | `string` | Runs the referer operation. |
| `value.isAjax()` | `boolean` | Reports whether ajax. |
| `value.scheme()` | `string` | Runs the scheme operation. |
| `value.fullURL()` | `string` | Runs the full url operation. |
| `value.accepts(mimeType: string)` | `boolean` | Runs the accepts operation. |
| `value.getFloat(key: string)` | `number` | Returns float. |
| `value.redirectPermanent(url: string)` | `void` | Runs the redirect permanent operation. |
| `value.basicAuth()` | `object` | Runs the basic auth operation. |

### `serveRouter` values

Methods available on `serveRouter` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.GET(pattern: string, ...handlers: serveHandler)` | `void` | Registers a GET route handler. |
| `value.POST(pattern: string, ...handlers: serveHandler)` | `void` | Registers a POST route handler. |
| `value.PUT(pattern: string, ...handlers: serveHandler)` | `void` | Registers a PUT route handler. |
| `value.PATCH(pattern: string, ...handlers: serveHandler)` | `void` | Registers a PATCH route handler. |
| `value.DELETE(pattern: string, ...handlers: serveHandler)` | `void` | Registers a DELETE route handler. |
| `value.OPTIONS(pattern: string, ...handlers: serveHandler)` | `void` | Registers a OPTIONS route handler. |
| `value.HEAD(pattern: string, ...handlers: serveHandler)` | `void` | Registers a HEAD route handler. |
| `value.ANY(pattern: string, ...handlers: serveHandler)` | `void` | Registers a ANY route handler. |
| `value.WS(pattern: string, server: *wsServer)` | `void` | Runs the ws operation. |
| `value.static(prefix: string, dir: string)` | `void` | Runs the static operation. |
| `value.staticFile(pattern: string, filepath: string)` | `void` | Runs the static file operation. |
| `value.loadHTMLGlob(pattern: string)` | `error` | Loads htmlglob. |
| `value.LoadHTMLGlob(pattern: string)` | `error` | Loads htmlglob. |
| `value.use(...handlers: serveHandler)` | `*serveRouter` | Runs the use operation. |
| `value.group(prefix: string, ...fn?: func(router))` | `*serveRouter` | Creates a route group with optional router callback functions. |
| `value.Use(...handlers: serveHandler)` | `*serveRouter` | Runs the use operation. |
| `value.Group(prefix: string, fn?: function)` | `*serveRouter` | Creates a route group with an optional setup callback. |
| `value.Static(prefix: string, dir: string)` | `void` | Runs the static operation. |
| `value.StaticFile(pattern: string, filepath: string)` | `void` | Runs the static file operation. |
| `value.Run(addr: string)` | `error` | Runs the run operation. |
| `value.run(addr: string)` | `error` | Runs the run operation. |
| `value.RunTLS(addr: string, certFile: string, keyFile: string)` | `error` | Runs tls. |
| `value.runTLS(addr: string, certFile: string, keyFile: string)` | `error` | Runs tls. |
| `value.Handler()` | `http.Handler` | Runs the handler operation. |
| `value.serve(addr: string)` | `error` | Runs the serve operation. |
| `value.serveTLS(addr: string, certFile: string, keyFile: string)` | `error` | Runs the serve tls operation. |
| `value.handler()` | `http.Handler` | Runs the handler operation. |

## Notes

- Standard-library imports accept both `import "osl/serve"` and `import "serve"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
