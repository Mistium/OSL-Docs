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
- `app.serve(addr)` — start the server (blocks)
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
