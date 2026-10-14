# serve

`serve` runs HTTP servers with routes, middleware, templates, static files and WebSocket
endpoints.

```osl
import "std:serve"
```

## Quick start

```osl
import "std:serve"

*serve.Router app = serve.new()

app.get("/", def(*serve.Context c) -> (
  c.text(200, "Hello, World!")
))

app.get("/ping", def(*serve.Context c) -> (
  c.json(200, {message: "pong"})
))

log "Listening on http://localhost:8080"
app.run(":8080")
```

A handler takes a `*serve.Context` and writes a response. Create the router with `serve.new()`,
register routes, then call `app.run(address)`, which blocks until `app.stop()`. Run it in a
[thread](thread.md) to keep going.

## Routing

Register handlers for each HTTP method:

```osl
app.get("/users", listUsers)
app.post("/users", createUser)
app.put("/users/:id", replaceUser)
app.patch("/users/:id", updateUser)
app.delete("/users/:id", deleteUser)
app.any("/health", healthCheck)
```

`:name` matches one path segment; read it with `c.param("name")`. A final `{name...}` matches the
rest of the path. Registering the same method and pattern again replaces its handlers.

```osl
app.get("/users/:id", def(*serve.Context c) -> (
  int id = c.paramInt("id", 0)
  c.json(200, {id: id})
))

app.get("/files/{path...}", def(*serve.Context c) -> (
  c.text(200, c.param("path"))
))
```

A route takes several handlers, which run in order; each one calls `c.next()` to continue.

## Reading the request

Lookups that may be absent return `T?`, so use `??` or a null check:

```osl
app.get("/search", def(*serve.Context c) -> (
  string q = c.query("q") ?? ""
  int page = c.queryInt("page", 1)
  string agent = c.userAgent() ?? "unknown"
  c.json(200, {q: q, page: page, agent: agent})
))

app.post("/users", def(*serve.Context c) -> (
  object input = c.bodyJSON()
  c.json(201, {created: input.name})
))
```

When `queryInt`, `queryBool`, `paramInt` or `bodyJSON` fails and the handler doesn't catch it, the
client gets `400` instead of `500`. A body larger than the router's `bodyLimit` answers `413`.

## Writing the response

```osl
c.text(200, "plain text")
c.json(200, {ok: true})
c.html(200, "<h1>Hi</h1>")
c.send(200, "image/png", bytes)
c.redirect(302, "/login")
c.noContent()
c.file("./public/report.pdf")
c.attachment("./r.pdf", "report.pdf")

c.badRequest("missing field")    // 400 {"error": "missing field"}
c.unauthorized("login required") // 401
c.forbidden("no access")         // 403
c.notFound("no such user")       // 404
c.internalError("oops")          // 500

c.setHeader("X-App", "osl")
c.setCookie("session", token, {maxAge: 3600000, httpOnly: true, secure: true})
```

## Middleware

Middleware are handlers that run before the route's handlers. Add them with `app.use(...)`; they
apply to routes registered after them. Call `c.next()` to continue, or write a response to stop.

```osl
app.use(serve.logger())
app.use(serve.cors("https://example.com", "GET,POST", "Content-Type"))
app.use(serve.limitRequests(100, {window: 60000}))
app.use(serve.secureHeaders())
app.use(serve.requestID())
```

Your own middleware is a handler:

```osl
def auth(*serve.Context c) (
  string? token = c.bearer()
  if token == null (
    c.unauthorized("no token")
    return
  )
  c.set("user", token)
  c.next()
)

app.use(auth)
```

A handler that throws never crashes the server: the error is printed with its source line and the
client gets `500` (or `400` for an uncaught `ValueError`/`ParseError` from a request accessor).

## Route groups

```osl
*serve.Router api = app.group("/api")
api.use(serve.requireBearer("secret"))
api.get("/users", listUsers)

app.group("/admin", def(*serve.Router admin) -> (
  admin.use(serve.basicAuth("admin", "hunter2"))
  admin.get("/", def(*serve.Context c) -> (
    c.text(200, "hello " ++ c.credentials().username)
  ))
))
```

A group shares its parent's middleware; middleware added to the group stays in the group. It
renders with the parent's views, layout and locals unless it sets its own.

## Static files

```osl
app.static("/assets", "./public")
app.staticFile("/favicon.ico", "./fav.ico")
```

Paths that escape the directory, including through symlinks, answer `404`.

## Views

`c.render(name, data)` renders `<views>/<name>.html` with [template](template.md) syntax,
HTML-escaping values. Use `{{& key}}` for trusted raw HTML. The router's `locals` are merged into
the data, and with a `layout` the page is wrapped in that view, which receives it as `body`.

```osl
import "std:serve"
import "std:md"

// views/layout.html: <!doctype html><title>{{title}}</title><main>{{& body}}</main>
// views/post.html:   <h1>{{title}}</h1><article>{{& html}}</article>

*serve.Router app = serve.new()
app.views("views").layout("layout").locals({site: "My blog"})

app.get("/", def(*serve.Context c) -> (
  c.render("post", {title: "Hello", html: md.toHTML("**bold** and _italic_")})
))

app.get("/missing", def(*serve.Context c) -> (
  c.render("post", {title: "Not found", html: ""}, {status: 404})
))
```

## WebSockets

Mount a [ws](ws.md) server with `app.ws`. HTTP and WebSocket routes can share a path: upgrade
requests go to the socket after the middleware, other requests reach the HTTP handlers.

```osl
import "std:serve"
import "std:ws"

*serve.Router app = serve.new()
*ws.Server socket = ws.new()
socket.on("message", def(*ws.Connection conn, string msg) -> (
  conn.send("echo: " ++ msg)
))

app.get("/", def(*serve.Context c) -> (
  c.text(200, "open a websocket on /")
))
app.ws("/", socket)
app.run(":8080")
```

Inside a handler, `c.isWebSocket()` and `c.upgrade(socket)` do the same by hand.

## HTTPS

```osl
app.runTLS(":443", "cert.pem", "key.pem")
```

## API reference

### `serve`

| Method | Returns | Notes |
| --- | --- | --- |
| `serve.new()` | `*serve.Router` | A new router. |

Middleware factories, each returning a `serve.Handler`:

| Method | Notes |
| --- | --- |
| `serve.logger()` | Prints one line per request: time, method, path, status, response bytes and duration. |
| `serve.cors(allowOrigin: string, allowMethods: string, allowHeaders: string)` | Sets CORS headers (comma-separated lists), with credentials unless the origin is `"*"`, and answers preflight `OPTIONS` with `204`. |
| `serve.corsOpen()` | `cors` allowing any origin, every common method and any header. |
| `serve.limitRequests(maxRequests: int, options?)` | At most `maxRequests` per client IP per window, then `429`. Option: `window` (ms, default 60000). Throws `ValueError` when `maxRequests` is below 1. |
| `serve.timeLimit(timeout: int)` | Answers `503` when the rest of the chain takes longer than `timeout` ms; a late response is discarded. Output is buffered, so don't put streaming or WebSocket handlers behind it. |
| `serve.requireBearer(token: string)` | `401` unless the request has `Authorization: Bearer <token>`. |
| `serve.basicAuth(username: string, password: string)` | `401` with a Basic challenge unless the request carries these credentials. |
| `serve.requireHeader(name: string, value: string)` | `400` unless header `name` equals `value`, ignoring case. |
| `serve.maxBodySize(maxBytes: int)` | Limits the request body of the routes it guards; larger bodies answer `413`. |
| `serve.requestID()` | Gives every request an id (reusing the client's `X-Request-ID`), sets it as the `X-Request-ID` response header and as `c.get("requestID")`. |
| `serve.secureHeaders()` | Sets common security headers (nosniff, frame denial, no referrer). |
| `serve.noCache()` | Tells clients not to cache responses. |
| `serve.setKey(key: string, value)` | Stores `value` under `key` on every request. |

### `*serve.Router`

| Method | Returns | Notes |
| --- | --- | --- |
| `app.get(pattern: string, ...handlers)` | `void` | Routes GET requests. Throws `ValueError` without handlers and `TypeError` for a non-function. |
| `app.post`, `app.put`, `app.patch`, `app.delete`, `app.head` | `void` | Same, for that method. |
| `app.options(pattern, ...handlers)` | `void` | Without one, an `OPTIONS` request runs the middleware and answers `204` with an `Allow` header. |
| `app.any(pattern, ...handlers)` | `void` | GET, POST, PUT, PATCH, DELETE, OPTIONS and HEAD. |
| `app.ws(pattern: string, server: *ws.Server)` | `void` | Mounts a WebSocket server. |
| `app.use(...handlers)` | `*serve.Router` | Adds middleware for routes registered after it. |
| `app.group(prefix: string, setup?)` | `*serve.Router` | A router whose routes start with `prefix`. `setup`, if given, is called with the group. |
| `app.static(prefix: string, dir: string)` | `void` | Serves files under `dir` at `prefix`. |
| `app.staticFile(pattern: string, path: string)` | `void` | Serves one file. |
| `app.views(dir: string)` | `*serve.Router` | Directory `c.render` reads `<name>.html` views from. |
| `app.layout(name: string)` | `*serve.Router` | View every `c.render` wraps its page in, as `{{& body}}`. |
| `app.locals(values: object)` | `*serve.Router` | Values every render merges into its data. |
| `app.bodyLimit(maxBytes: int)` | `*serve.Router` | Largest request body a handler can read (default 32 MiB, 0 for none); larger bodies answer `413`. |
| `app.run(address: string)` | `result<unit, error>` | Serves on `address`, such as `":8080"`, until `stop()`. Fails with `NetworkError` when the address can't be bound; throws `StateError` when already running. |
| `app.runTLS(address: string, certFile: string, keyFile: string)` | `result<unit, error>` | `run` over HTTPS. Fails with `NotFoundError` or `IOError` when the PEM files can't be read. |
| `app.stop()` | `result<unit, error>` | Closes the server and mounted WebSocket connections; `run()` returns. Does nothing when not running. |

### `*serve.Context`: request

| Method | Returns | Notes |
| --- | --- | --- |
| `c.method()` | `string` | Such as `"GET"`. |
| `c.path()` | `string` | Such as `"/users/42"`. |
| `c.host()` | `string` | The Host the request was sent to. |
| `c.remoteAddr()` | `string` | Client `host:port`. |
| `c.ip()` | `string` | Client IP, preferring `X-Forwarded-For` and `X-Real-IP`. |
| `c.scheme()` | `string` | `"https"` or `"http"`, honouring `X-Forwarded-Proto`. |
| `c.fullURL()` | `string` | Absolute URL of the request. |
| `c.param(key: string)` | `string` | A path parameter. Throws `ValueError` when the route has no such parameter. |
| `c.paramInt(key: string, def: int)` | `result<int, error>` | A path parameter as an integer, or `def` when empty. Fails with `ValueError`. |
| `c.query(key: string)` | `string?` | First value of a query parameter. |
| `c.queryInt(key: string, def: int)` | `result<int, error>` | `def` when absent or empty. Fails with `ValueError`. |
| `c.queryBool(key: string, def: boolean)` | `result<boolean, error>` | Accepts `"true"`, `"false"`, `"1"`, `"0"` and similar. Fails with `ValueError`. |
| `c.queryAll()` | `string[string]` | Every query parameter with its first value. |
| `c.queryArray(key: string)` | `string[]` | Every value of a repeated parameter; empty when absent. |
| `c.header(name: string)` | `string?` | A request header (case-insensitive), first value. |
| `c.headers()` | `string[string]` | Request headers by canonical name; repeats joined with `", "`. |
| `c.hasHeader(name: string, value: string)` | `boolean` | Whether the header equals `value`, ignoring case. |
| `c.bearer()` | `string?` | Token of an `Authorization: Bearer` header. |
| `c.credentials()` | `{username, password}?` | HTTP Basic credentials, or `null`. |
| `c.userAgent()`, `c.referer()` | `string?` | Those headers. |
| `c.contentType()` | `string` | Request media type without parameters, or `""`. |
| `c.isJSON()`, `c.isForm()`, `c.isAjax()`, `c.isWebSocket()` | `boolean` | Request kind checks. |
| `c.accepts(mediaType: string)` | `boolean` | Whether `Accept` allows `mediaType`; true when missing or `*/*`. |
| `c.body()` | `string` | The body; can be read any number of times. Throws `IOError` (after answering `413` or `400`) when too large or unreadable, which ends the handler without a `500`. |
| `c.bodyBytes()` | `byte[]` | The body as bytes. |
| `c.bodyJSON()` | `result<object, error>` | Fails with `ParseError` when the body isn't a JSON object. |
| `c.bodyJSONArray()` | `result<array, error>` | Fails with `ParseError` when the body isn't a JSON array. |
| `c.bindJSON(out)` | `result<unit, error>` | Decodes the body into an object or class instance. Fails with `ParseError`. |
| `c.formValue(key: string)` | `string?` | A form field (URL-encoded, multipart or query). |
| `c.formFile(key: string)` | `result<{filename, size, contentType, data}, error>` | An uploaded file; `data` is `byte[]`. Fails with `NotFoundError` when missing and `IOError` when too large (`413`) or malformed. |
| `c.cookie(name: string)` | `string?` | A request cookie. |
| `c.cookies()` | `string[string]` | Every request cookie. |

### `*serve.Context`: response

| Method | Returns | Notes |
| --- | --- | --- |
| `c.status(code: int)` | `void` | Sets the status without a body. |
| `c.text(status: int, body: string)` | `void` | `text/plain`. |
| `c.json(status: int, value)` | `void` | JSON. Throws `TypeError` when `value` can't be encoded. |
| `c.html(status: int, html: string)` | `void` | `text/html`. |
| `c.render(name: string, data: object, options?)` | `void` | Renders a view (see [Views](#views)). Option: `status` (default 200). Throws `NotFoundError` for a missing view and `ParseError` for a malformed one. |
| `c.send(status: int, contentType: string, body: string \| byte[])` | `void` | Any content type. |
| `c.redirect(status: int, url: string)` | `void` | 301, 302, 303, 307 or 308. |
| `c.noContent()` | `void` | Empty `204`. |
| `c.file(path: string)` | `void` | Sends a file with its Content-Type, range and caching support; a missing file answers `404`. |
| `c.attachment(path: string, filename: string)` | `void` | Sends a file as a download. |
| `c.badRequest(message)`, `c.unauthorized(message)`, `c.forbidden(message)`, `c.notFound(message)`, `c.internalError(message)` | `void` | Abort with 400, 401, 403, 404 or 500 and `{"error": message}`. |
| `c.setHeader(name: string, value: string)` | `void` | Replaces earlier values. |
| `c.addHeader(name: string, value: string)` | `void` | Keeps earlier values. |
| `c.setCookie(name: string, value: string, options?)` | `void` | Options: `maxAge` (ms, rounded down to seconds; 0 makes a session cookie), `path` (default `"/"`), `domain`, `secure`, `httpOnly` (both default `false`), `sameSite` (`"lax"` default, `"strict"`, `"none"`). |
| `c.clearCookie(name: string)` | `void` | Deletes a cookie set with path `"/"`. |
| `c.flush()` | `void` | Sends what has been written so far, for streaming. |
| `c.upgrade(server: *ws.Server)` | `result<unit, error>` | Hands the request to a ws server. Fails with `ValueError` (after answering `400`) when it isn't an upgrade; throws `StateError` when a response was already written. |
| `c.isWritten()` | `boolean` | Whether a response status has been sent. |
| `c.statusCode()` | `int` | Status sent so far, or 200. |
| `c.responseSize()` | `int` | Body bytes written so far. |

### `*serve.Context`: flow and state

| Method | Returns | Notes |
| --- | --- | --- |
| `c.next()` | `void` | Runs the rest of the chain; middleware can act after it returns. |
| `c.abort(status?, message?)` | `void` | Stops the chain after this handler. With a status, sends an empty response; with a message too, sends `{"error": message}`. Nothing is sent if a response was already written. |
| `c.isAborted()` | `boolean` | Whether `abort` was called. |
| `c.set(key: string, value)` | `void` | Stores a value for later handlers. |
| `c.get(key: string)` | `any` | A stored value, or `null`. |

## Behavior and limits

`c.query`, `c.header`, `c.cookie`, `c.bearer` and `c.formValue` return `null` for a missing value,
not `""`. Comparing one with `""` or joining it into a string with `++` is a compile error, so
write `?? ""` or check for `null` first.

Body helpers cache the request bytes, so reading JSON, a form or a bound value doesn't consume the
body for later helpers.

## Changes from earlier versions

`c.setCookie` takes only an options object, with `maxAge` in milliseconds, and `c.html` takes no
template data: render views with `app.views(dir)` and `c.render(name, data)`. Older helpers such as
`c.string`, `c.ok`, `app.serve`, `serve.rateLimit` and `serve.timeout` are gone; use `c.text`,
`c.json(200, value)`, `app.run`, `serve.limitRequests` and `serve.timeLimit`.
