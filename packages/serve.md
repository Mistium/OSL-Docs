# serve

`serve` is OSL's web framework. It gives you a router, request/response **contexts**, middleware, route
groups, static-file serving, WebSockets and TLS.

```osl
import "std:serve"
```

## Quick start

```osl
import "std:serve"

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

```osl
app.GET("/users", listUsers)
app.POST("/users", createUser)
app.PUT("/users/:id", replaceUser)
app.PATCH("/users/:id", updateUser)
app.DELETE("/users/:id", deleteUser)
app.ANY("/health", healthCheck)     // any method
```

### Route parameters

Use `:name` in a pattern and read it with `c.param(...)`:

```osl
app.GET("/users/:id", def(*serve.Context c) -> (
  string id = c.param("id")
  c.json(200, { id: id })
))
```

## The Context

The `*serve.Context` (named `c` by convention) is how you read the request and write the response.

### Reading the request

```osl
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

```osl
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

```osl
c.set("userId", 42)
int id = c.getInt("userId")
```

## Middleware

Middleware are handlers that run before your route handler. Register them with `use(...)`; call
`c.next()` to continue or one of the response helpers to stop. The framework ships ready-made
middleware:

```osl
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

`timeout` buffers downstream output until the handler completes and cancels the request context at
the deadline. Do not place streaming, flushing, or WebSocket handlers behind it.

Even without `serve.recover()`, a handler that throws never crashes the server: the error is
printed to stderr as a formatted OSL runtime error (with the source line that caused it) and the
client gets a plain `500 Internal Server Error`. Use `serve.recover()` when you want the error
text in the response body instead.

Writing your own is just a handler:

```osl
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

```osl
*serve.Router api = app.group("/api")
api.use(serve.requireBearer("secret"))
api.GET("/users", listUsers)
api.GET("/posts", listPosts)
```

## Static files

```osl
app.static("/assets", "./public")           // serve a directory
app.staticFile("/favicon.ico", "./fav.ico") // serve a single file
```

## HTML templates

Load Go `html/template` files with `loadHTMLGlob`, then render one by name with
`c.html(code, name, data)`. Register custom template functions with `setFuncMap`.
call it **before** `loadHTMLGlob` so the parsed templates can see them:

```osl
def upper(string s) string (
  return s.toUpper()
)

*serve.Router app = serve.new()
app.setFuncMap({"upper": upper})
app.loadHTMLGlob("templates/**/*.html")

app.GET("/", def(*serve.Context c) -> (
  c.html(200, "home.html", { name: "world" })
))
```

Templates are named by their base filename, plus any `{{define "name"}}` blocks.

## OSL-native pages (`render` + layouts)

For OSL apps, prefer [`osl/template`](template.md) over Go's `html/template`. Point the
router at a views directory with `views(dir)`, optionally set a wrapping `layout(name)`,
then respond with `c.render(name, data)`. Views are `<dir>/<name>.html` and render through
`template.renderHTML`. Values are HTML-escaped by default. Use `{{& field}}` for
trusted raw HTML (e.g. Markdown you rendered with [`md`](md.md)).

The layout receives the rendered page as `body`; emit it raw with `{{& body}}`.

```osl
import "std:serve"
import "std:md"

// views/layout.html →  <!doctype html><title>{{ title }}</title><main>{{& body}}</main>
// views/post.html   →  <h1>{{ title }}</h1><article>{{& html}}</article>

*serve.Router app = serve.new()
app.views("views")
app.layout("layout")

app.GET("/", def(*serve.Context c) -> (
  c.render("post", {
    title: "Hello",
    html:  md.toHTML("**bold** and _italic_")   // composed, not reimplemented
  })
))
```

`render` always responds `200`. Set other statuses with `c.html`/`c.string`, or render the
body yourself and pass it to `c.send(code, "text/html", body)`.

## CORS preflight

An `OPTIONS` request to a route with no explicit `OPTIONS` handler runs the router's
middleware chain (so `serve.cors(...)` / `serve.corsOpen()` can answer the preflight) and
responds `204` with an `Allow` header if no middleware wrote a response.

## WebSockets

Attach a [`ws`](ws.md) server to a route with `app.WS`. HTTP and websockets can share a
path. Upgrade requests go to the socket, while other requests reach the HTTP handlers. You can
also upgrade from inside a handler with `c.isWebsocket()` / `c.upgrade(socket)`.

```osl
import "std:serve"
import "std:ws"

*serve.Router app = serve.new()
auto socket = ws.New()   // no listen address; serve owns the port

socket.OnMessage(def(*ws.Connection conn, string msg) -> (
  conn.Send("echo: " ++ msg)
))

// Dedicated path
app.WS("/chat", socket)

// HTTP and WebSocket routes can share a path:
app.GET("/", def(*serve.Context c) -> (
  c.string(200, "open a websocket on /")
))
app.WS("/", socket)

app.serve(":8080")
```

## HTTPS / TLS

```osl
app.serveTLS(":443", "cert.pem", "key.pem")
```

## Method reference

### Router (`serve.new()` → `*serve.Router`)

- `app.GET(pattern, ...handlers)` · `POST` · `PUT` · `PATCH` · `DELETE` · `OPTIONS` · `HEAD` · `ANY`
- `app.WS(pattern, wsServer)`
- `app.use(...handlers)` → `*serve.Router`
- `app.group(prefix, fn?)` → `*serve.Router`
- `app.static(prefix, dir)` · `app.staticFile(pattern, filepath)`
- `app.setFuncMap(funcs)` - register template functions (call before `loadHTMLGlob`)
- `app.loadHTMLGlob(pattern)` - parse HTML templates for `c.html(code, name, data)`
- `app.views(dir)` - set the directory for `c.render` views (`<dir>/<name>.html`)
- `app.layout(name)` - wrap `c.render` output in `views/<name>.html` via `{{& body}}`
- `app.serve(addr)` - start the server (blocks)
- `app.serveTLS(addr, certFile, keyFile)`
- `app.handler()` → the underlying HTTP handler

### Middleware factories (on `serve`)

`logger()`, `cors(allowOrigin, allowMethods, allowHeaders)`, `corsOpen()`, `rateLimit(max, windowSeconds)`,
`requireBearer(token)`, `requireHeader(key, value)`, `maxBodySize(bytes)`, `recover()`, `timeout(seconds)`,
`setKey(key, value)`, `basicAuth(user, pass)`, `requestID()`, `secureHeaders()`, `noCache()`.

### Context (`*serve.Context`)

**Read:** `method()`, `path()`, `host()`, `ip()`, `param(k)`, `query(k)`, `queryDefault(k, d)`,
`queryInt(k, d)`, `queryBool(k, d)`, `queryArray(k)`, `header(k)`, `headers()`, `bearer()`, `body()`,
`bodyBytes()`, `bodyJSON()`, `bodyJSONArray()`, `formValue(k)`, `formFile(k)`, `cookie(k)`, `cookies()`,
`userAgent()`, `referer()`, `isJSON()`, `isForm()`, `isWebSocket()` / `isWebsocket()`, `isAjax()`,
`contentType()`, `fullURL()`.

**Write:** `status(code)`, `string(code, text)`, `json(code, obj)`, `html(code, body)`, `text(code, body)`,
`data(code, contentType, bytes)`, `redirect(code, url)`, `noContent()`, `ok(obj)`, `created(obj)`,
`badRequest(msg)`, `unauthorized(msg)`, `forbidden(msg)`, `notFound(msg)`, `internalError(msg)`,
`file(path)`, `attachment(path, name)`, `setHeader(k, v)`, `addHeader(k, v)`, `setCookie(...)`,
`clearCookie(name)`, `upgrade(wsServer)` / `Upgrade(wsServer)`.

**Flow & state:** `next()`, `abort(...)`, `isAborted()`, `set(k, v)`, `get(k)`, `getString(k)`,
`getInt(k)`, `getBool(k)`, `getFloat(k)`.

## Complete API reference

### `serve`

| Method | Returns | Notes |
| --- | --- | --- |
| `serve.new()` | `*serveRouter` |  |
| `serve.New()` | `*serveRouter` |  |
| `serve.logger()` | `serveHandler` |  |
| `serve.cors(allowOrigin: string, allowMethods: string, allowHeaders: string)` | `serveHandler` |  |
| `serve.corsOpen()` | `serveHandler` |  |
| `serve.rateLimit(maxRequests: number, windowSeconds: number)` | `serveHandler` | Limits requests per client without a background worker; nonpositive windows use one second. |
| `serve.requireBearer(token: string)` | `serveHandler` |  |
| `serve.requireHeader(key: string, value: string)` | `serveHandler` |  |
| `serve.maxBodySize(maxBytes: number)` | `serveHandler` |  |
| `serve.recover()` | `serveHandler` |  |
| `serve.timeout(seconds: number)` | `serveHandler` | Cancels the downstream request context at the deadline and returns a buffered 503 response without allowing late handler writes to reach the client. |
| `serve.setKey(key: string, value: any)` | `serveHandler` | Sets key. |
| `serve.basicAuth(username: string, password: string)` | `serveHandler` |  |
| `serve.requestID()` | `serveHandler` |  |
| `serve.secureHeaders()` | `serveHandler` |  |
| `serve.noCache()` | `serveHandler` |  |

### `serveContext` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.status(code: number)` | `void` |  |
| `value.string(code: number, format: string, ...values: any)` | `void` |  |
| `value.json(code: number, obj: any)` | `void` |  |
| `value.html(code: number, body: string, ...data: any)` | `void` |  |
| `value.HTML(code: number, name: string, data: any)` | `void` |  |
| `value.render(name: string, data: object)` | `void` | Renders `views/<name>.html` via `osl/template` (escaped; `{{& x}}` for raw), wraps in the layout if set, responds `200`. |
| `value.data(code: number, contentType: string, body: byte[])` | `void` | Sends a byte body with the given content type. |
| `value.redirect(code: number, url: string)` | `void` |  |
| `value.noContent()` | `void` |  |
| `value.ok(obj: any)` | `void` |  |
| `value.created(obj: any)` | `void` |  |
| `value.next()` | `void` |  |
| `value.abort(...values: any)` | `void` |  |
| `value.isAborted()` | `boolean` |  |
| `value.badRequest(message: string)` | `void` |  |
| `value.unauthorized(message: string)` | `void` |  |
| `value.forbidden(message: string)` | `void` |  |
| `value.notFound(message: string)` | `void` |  |
| `value.internalError(message: string)` | `void` |  |
| `value.flush()` | `void` |  |
| `value.method()` | `string` |  |
| `value.path()` | `string` |  |
| `value.host()` | `string` |  |
| `value.remoteAddr()` | `string` |  |
| `value.ip()` | `string` |  |
| `value.isWebSocket()` | `boolean` | `true` when the request is a WebSocket upgrade. |
| `value.isWebsocket()` | `boolean` | Same as `isWebSocket()` with the more natural OSL casing. |
| `value.upgrade(server: *wsServer)` | `boolean` | Hijacks this request into the given websocket server. Returns `false` if already written, not an upgrade, or server is nil. |
| `value.Upgrade(server: *wsServer)` | `boolean` | Alias of `upgrade`. |
| `value.contentType()` | `string` |  |
| `value.isJSON()` | `boolean` |  |
| `value.isForm()` | `boolean` |  |
| `value.query(key: string)` | `string` |  |
| `value.queryDefault(key: string, def: string)` | `string` |  |
| `value.queryInt(key: string, def: number)` | `number` | Parses an integer query value, returning the default when absent or invalid. |
| `value.queryBool(key: string, def: boolean)` | `boolean` |  |
| `value.queryAll()` | `object` |  |
| `value.param(key: string)` | `string` |  |
| `value.paramInt(key: string, def: number)` | `number` | Parses an integer route parameter, returning the default when absent or invalid. |
| `value.header(key: string)` | `string` |  |
| `value.headers()` | `object` | Every request header as an object (single values are strings; multi-value headers become arrays). |
| `value.Headers()` | `object` | Alias of `headers`. |
| `value.hasHeader(key: string, value: string)` | `boolean` |  |
| `value.setHeader(key: string, value: string)` | `void` | Sets header. |
| `value.addHeader(key: string, value: string)` | `void` | Adds header. |
| `value.bearer()` | `string` |  |
| `value.body()` | `string` |  |
| `value.bodyBytes()` | `byte[]` | Returns the request body bytes. |
| `value.bodyJSON()` | `object` |  |
| `value.bodyJSONArray()` | `array` |  |
| `value.bindJSON(out: any)` | `error` |  |
| `value.formValue(key: string)` | `string` |  |
| `value.formValueDefault(key: string, def: string)` | `string` |  |
| `value.formFile(key: string)` | `*Result` |  |
| `value.cookie(name: string)` | `string` |  |
| `value.setCookie(name: string, value: string, maxAge: number, path: string, domain: string, secure: boolean, httpOnly: boolean)` | `void` | Sets cookie. |
| `value.clearCookie(name: string)` | `void` |  |
| `value.set(key: string, value: any)` | `void` | Sets a value. |
| `value.get(key: string)` | `any` | Returns a value. |
| `value.getString(key: string)` | `string` | Returns string. |
| `value.getBool(key: string)` | `boolean` | Returns bool. |
| `value.getInt(key: string)` | `number` | Returns int. |
| `value.written()` | `boolean` |  |
| `value.text(code: number, body: string)` | `void` |  |
| `value.file(filepath: string)` | `void` |  |
| `value.attachment(filepath: string, filename: string)` | `void` |  |
| `value.queryArray(key: string)` | `array` |  |
| `value.cookies()` | `object` |  |
| `value.userAgent()` | `string` |  |
| `value.referer()` | `string` |  |
| `value.isAjax()` | `boolean` |  |
| `value.scheme()` | `string` |  |
| `value.fullURL()` | `string` |  |
| `value.accepts(mimeType: string)` | `boolean` |  |
| `value.getFloat(key: string)` | `number` | Returns float. |
| `value.redirectPermanent(url: string)` | `void` |  |
| `value.basicAuth()` | `object` |  |

### `serveRouter` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.GET(pattern: string, ...handlers: serveHandler)` | `void` | Registers a GET route handler. |
| `value.POST(pattern: string, ...handlers: serveHandler)` | `void` | Registers a POST route handler. |
| `value.PUT(pattern: string, ...handlers: serveHandler)` | `void` | Registers a PUT route handler. |
| `value.PATCH(pattern: string, ...handlers: serveHandler)` | `void` | Registers a PATCH route handler. |
| `value.DELETE(pattern: string, ...handlers: serveHandler)` | `void` | Registers a DELETE route handler. |
| `value.OPTIONS(pattern: string, ...handlers: serveHandler)` | `void` | Registers a OPTIONS route handler. |
| `value.HEAD(pattern: string, ...handlers: serveHandler)` | `void` | Registers a HEAD route handler. |
| `value.ANY(pattern: string, ...handlers: serveHandler)` | `void` | Registers a ANY route handler. |
| `value.WS(pattern: string, server: *wsServer)` | `void` | Mounts a WebSocket server on `pattern`. Upgrades reach the socket; other requests continue to the HTTP handlers on the same path. |
| `value.static(prefix: string, dir: string)` | `void` |  |
| `value.staticFile(pattern: string, filepath: string)` | `void` |  |
| `value.loadHTMLGlob(pattern: string)` | `error` | Loads htmlglob. |
| `value.LoadHTMLGlob(pattern: string)` | `error` | Loads htmlglob. |
| `value.views(dir: string)` | `*serveRouter` | Sets the views directory for `c.render`. |
| `value.layout(name: string)` | `*serveRouter` | Sets the layout template wrapping `c.render` output. |
| `value.use(...handlers: serveHandler)` | `*serveRouter` |  |
| `value.group(prefix: string, ...fn?: func(router))` | `*serveRouter` | Creates a route group with optional router callback functions. |
| `value.Use(...handlers: serveHandler)` | `*serveRouter` |  |
| `value.Group(prefix: string, fn?: function)` | `*serveRouter` | Creates a route group with an optional setup callback. |
| `value.Static(prefix: string, dir: string)` | `void` |  |
| `value.StaticFile(pattern: string, filepath: string)` | `void` |  |
| `value.Run(addr: string)` | `error` |  |
| `value.run(addr: string)` | `error` |  |
| `value.RunTLS(addr: string, certFile: string, keyFile: string)` | `error` | Runs tls. |
| `value.runTLS(addr: string, certFile: string, keyFile: string)` | `error` | Runs tls. |
| `value.Handler()` | `http.Handler` |  |
| `value.serve(addr: string)` | `error` | Starts the active HTTP server and blocks until it stops. |
| `value.serveTLS(addr: string, certFile: string, keyFile: string)` | `error` | Starts the active HTTPS server and blocks until it stops. |
| `value.handler()` | `http.Handler` |  |
| `value.stop()` | `boolean` | Blocks new WebSocket registrations, closes the HTTP listener, and drains mounted WebSockets; repeated calls are safe. |

## Notes

- Prefer `import "std:serve"`; the older `import "osl/serve"` spelling remains supported.

## Behavior and limits

Body helpers cache the request bytes, so reading JSON, forms, or a bound value does not consume the
body for later helpers. Static routes reject path traversal through symbolic links. Client IP
parsing accepts IPv6. Panic recovery and shutdown have time limits.

Shutdown rejects new WebSocket upgrades before closing the listener. When `stop` returns, no
upgrade that started during shutdown can leave a connection running.
