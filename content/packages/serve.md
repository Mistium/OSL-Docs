---
description: Build HTTP servers with routes, path parameters, JSON, middleware, cookies, forms, templates and static files.
package: serve
---

# serve

`std:serve` runs HTTP servers. You create a router, attach handlers to paths, and start it. Reach for it for web APIs, websites, webhooks and small internal tools. For live two-way messaging, mount a [ws](ws.md) server on the same router. To call a server from OSL, use [requests](requests.md).

Every example on this page starts a server on `127.0.0.1`, calls it with `requests`, prints what came back and stops it, so you can run each one as it is.

## A first server

`serve.new()` makes a router. `app.get(path, handler)` adds a route, and the handler receives a `*serve.Context` that holds the request and writes the response. `app.start(address)` begins listening and returns as soon as it is ready, which lets one program be both server and client:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.get("/hello", def(*serve.Context c) (
  c.text(200, "Hello from OSL")
))

app.start("127.0.0.1:8760").unwrap()

auto reply = requests.get("http://127.0.0.1:8760/hello").unwrap()
log reply.status reply.body

app.stop().unwrap()
```

```output
200 Hello from OSL
```

Change the text, or the status to `201`, and run it again.

Handlers with a block body are written `def(*serve.Context c) ( ... )`. The short `->` form only works for a handler that returns a value, and handlers don't, so use the block form.

`start` fails with a `NetworkError` if the port is taken, so it returns a result. `app.stop()` closes the server.

## Run or start

`app.run(address)` serves and blocks until `app.stop()` is called. That is what a real server's main file ends with:

```osl norun
import "std:serve"

auto app = serve.new()

app.get("/", def(*serve.Context c) (
  c.text(200, "up")
))

log "listening on http://localhost:8080"
app.run(":8080").unwrap()
```

Use `start` when the program has other work to do after the server is up, and `run` when serving is the program. `":8080"` listens on every interface, and `"127.0.0.1:8080"` only on this machine.

## Responses

A context has a method for each kind of response:

| Method | Sends |
| --- | --- |
| `c.text(status, string)` | plain text |
| `c.json(status, value)` | a value encoded as JSON |
| `c.html(status, string)` | an HTML string |
| `c.send(status, contentType, body)` | any string or bytes with a content type |
| `c.redirect(status, url)` | a redirect |
| `c.noContent()` | an empty 204 |
| `c.file(path)` | a file from disk |

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.get("/json", def(*serve.Context c) (
  c.json(200, {name: "ada", langs: ["osl", "go"]})
))
app.get("/page", def(*serve.Context c) (
  c.html(200, "<h1>Hi</h1>")
))
app.get("/old", def(*serve.Context c) (
  c.redirect(302, "/json")
))
app.get("/empty", def(*serve.Context c) (
  c.noContent()
))
app.start("127.0.0.1:8761").unwrap()

auto base = "http://127.0.0.1:8761"
auto a = requests.get(base ++ "/json").unwrap()
log a.status a.headers["Content-Type"] a.body.trim()
auto b = requests.get(base ++ "/page").unwrap()
log b.status b.headers["Content-Type"]
auto c1 = requests.get(base ++ "/old").unwrap()
log c1.status c1.url
auto d = requests.get(base ++ "/old", {redirects: false}).unwrap()
log d.status d.headers["Location"]
auto e = requests.get(base ++ "/empty").unwrap()
log e.status e.body.len

app.stop().unwrap()
```

```output
200 application/json; charset=utf-8 {"langs":["osl","go"],"name":"ada"}
200 text/html; charset=utf-8
200 http://127.0.0.1:8761/json
302 /json
204 0
```

JSON keys come out sorted. Notice that `requests` follows the redirect by default, so the second-to-last call ends up at `/json`. The `redirects: false` option shows the redirect itself.

## Paths and parameters

A `:name` segment matches one part of the path, and `c.param("name")` reads it. A trailing `{rest...}` matches everything left. Exact paths win over patterns:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.get("/users/:id", def(*serve.Context c) (
  c.text(200, "user " ++ c.param("id"))
))
app.get("/users/me", def(*serve.Context c) (
  c.text(200, "that's you")
))
app.get("/files/{path...}", def(*serve.Context c) (
  c.text(200, "file " ++ c.param("path"))
))
app.start("127.0.0.1:8762").unwrap()

auto base = "http://127.0.0.1:8762"
log requests.get(base ++ "/users/42").unwrap().body
log requests.get(base ++ "/users/me").unwrap().body
log requests.get(base ++ "/files/css/app.css").unwrap().body

app.stop().unwrap()
```

```output
user 42
that's you
file css/app.css
```

Try `/users/me/extra` or `/files/` (nothing after the slash) and see which route answers.

Path parameters are always strings. `c.paramInt("id", 0)` returns a result, so a non-number fails cleanly instead of crashing.

## Query strings

`c.query("key")` returns the value, or `null` when the parameter is missing, so pair it with `??` for a default. `c.queryInt` and `c.queryBool` convert for you:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.get("/search", def(*serve.Context c) (
  string q = c.query("q") ?? ""
  int page = c.queryInt("page", 1).unwrap()
  c.json(200, {q: q, page: page, tags: c.queryArray("tag")})
))
app.start("127.0.0.1:8763").unwrap()

auto base = "http://127.0.0.1:8763"
log requests.get(base ++ "/search?q=osl&page=3&tag=a&tag=b").unwrap().body.trim()
log requests.get(base ++ "/search").unwrap().body.trim()
auto bad = requests.get(base ++ "/search?page=two").unwrap()
log bad.status bad.body.trim()

app.stop().unwrap()
```

```output
{"page":3,"q":"osl","tags":["a","b"]}
{"page":1,"q":"","tags":[]}
400 {"error":"query parameter \"page\" is \"two\", not an integer"}
```

The last request shows a convenient rule: when a handler lets a request error such as a bad query integer escape (here through `unwrap()`), the client gets a 400 with a JSON message, not a 500. Handle the result yourself with `catch` when you want a different answer.

## Reading JSON bodies

`c.bodyJSON()` parses the request body as an object and returns a result. `c.bindJSON(out)` fills a class instance you pass in. Both fail with `ParseError` on bad input, and a handler that doesn't catch it answers 400:

```osl
import "std:serve"
import "std:requests"

class Todo (
  string title = ""
  boolean done = false
)

auto app = serve.new()

app.post("/todos", def(*serve.Context c) (
  Todo todo = Todo()
  c.bindJSON(todo).unwrap()
  if todo.title == "" (
    c.badRequest("title is required")
    return
  )
  c.json(201, todo)
))
app.start("127.0.0.1:8764").unwrap()

auto url = "http://127.0.0.1:8764/todos"
auto ok = requests.post(url, {json: {title: "write docs"}}).unwrap()
log ok.status ok.body.trim()
auto empty = requests.post(url, {json: {done: true}}).unwrap()
log empty.status empty.body.trim()
auto junk = requests.post(url, {body: "not json"}).unwrap()
log junk.status

app.stop().unwrap()
```

```output
201 {"title":"write docs","done":false}
400 {"error":"title is required"}
400
```

`c.badRequest(message)` is one of a family: `unauthorized` (401), `forbidden` (403), `notFound` (404) and `internalError` (500). Each ends the handler chain and sends `{"error": message}`. They don't return from your function, so follow them with `return` when more code would otherwise run.

## Middleware

Middleware is a handler that runs before the route's own. It calls `c.next()` to pass the request on, and can do work before and after. Register it with `app.use(...)` and it applies to every route added after it:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
int[] seen = []

app.use(def(*serve.Context c) (
  c.setHeader("X-Powered-By", "osl")
  c.set("started", "yes")
  c.next()
  seen.append(c.statusCode())
))

app.get("/ok", def(*serve.Context c) (
  c.text(200, "started: " ++ c.get("started"))
))

app.get("/gone", def(*serve.Context c) (
  c.text(410, "gone")
))

app.start("127.0.0.1:8765").unwrap()

auto r = requests.get("http://127.0.0.1:8765/ok").unwrap()
log r.body r.headers["X-Powered-By"]
log requests.get("http://127.0.0.1:8765/gone").unwrap().status

app.stop().unwrap()
log seen
```

```output
started: yes osl
410
[200,410]
```

`c.set(key, value)` and `c.get(key)` pass values from middleware to later handlers, such as the logged-in user. A middleware that calls `c.abort(...)` or one of the error methods (`unauthorized`, `forbidden`) and doesn't call `next` stops the request there.

### Built-in middleware

The package ships the middleware most servers need: `logger`, `cors`, `corsOpen`, `requireBearer`, `basicAuth`, `rateLimit`, `maxBodySize`, `timeLimit`, `requestID`, `secureHeaders` and `noCache`. Each is a function that returns a handler, so you call it when you register it:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.use(serve.secureHeaders())

app.get("/public", def(*serve.Context c) (
  c.text(200, "anyone")
))
app.get("/admin", serve.requireBearer("s3cret"), def(*serve.Context c) (
  c.text(200, "welcome")
))
app.get("/limited", serve.rateLimit({requests: 2, window: 60000}), def(*serve.Context c) (
  c.text(200, "ok")
))
app.start("127.0.0.1:8766").unwrap()

auto base = "http://127.0.0.1:8766"
auto a = requests.get(base ++ "/public").unwrap()
log a.status a.headers["X-Content-Type-Options"]
log requests.get(base ++ "/admin").unwrap().status
auto token = {headers: {Authorization: "Bearer s3cret"}}
log requests.get(base ++ "/admin", token).unwrap().status
for i in 1 to 3 (
  log "limited" i requests.get(base ++ "/limited").unwrap().status
)

app.stop().unwrap()
```

```output
200 nosniff
401
200
limited 1 200
limited 2 200
limited 3 429
```

A route takes any number of handlers, and they run in order, so `serve.requireBearer(...)` before the real handler guards that one route. Read secrets from [env](env.md) rather than writing them in the source. Tokens are compared in constant time, and an empty token (an unset variable) refuses every request.

> [!warning]
> `serve.rateLimit` counts visitors by `c.ip()`. Behind a reverse proxy on another machine, list it in `serve.new({trustProxy: [...]})`, or every visitor looks like the proxy.

## Groups

`app.group(prefix)` returns a router whose routes all start with a prefix and share the parent's middleware. Middleware added to the group stays in the group, which is how you guard a whole section:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "ok")
))

auto api = app.group("/api")
api.use(serve.requireBearer("s3cret"))
api.get("/me", def(*serve.Context c) (
  c.json(200, {user: "ada"})
))
api.get("/items/:id", def(*serve.Context c) (
  c.json(200, {item: c.paramInt("id", 0).unwrap()})
))
app.start("127.0.0.1:8767").unwrap()

auto base = "http://127.0.0.1:8767"
log requests.get(base ++ "/health").unwrap().status
log requests.get(base ++ "/api/me").unwrap().status
auto token = {headers: {Authorization: "Bearer s3cret"}}
log requests.get(base ++ "/api/me", token).unwrap().body.trim()
log requests.get(base ++ "/api/items/7", token).unwrap().body.trim()
log requests.get(base ++ "/api/items/x", token).unwrap().status

app.stop().unwrap()
```

```output
200
401
{"user":"ada"}
{"item":7}
400
```

## Cookies, headers and forms

Request headers come from `c.header(name)` (or `null`), and responses are shaped with `c.setHeader`. Cookies work the same way. `c.setCookie` is safe by default: `httpOnly`, `secure` and `sameSite: "lax"` are all on, so turn off only what you must. Forms posted by a browser are read with `c.formValue`:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

app.post("/login", def(*serve.Context c) (
  string name = c.formValue("name") ?? "stranger"
  c.setCookie("user", name, {maxAge: 3600000})
  c.text(200, "hello " ++ name)
))
app.get("/whoami", def(*serve.Context c) (
  c.text(200, c.cookie("user") ?? "nobody")
))
app.start("127.0.0.1:8768").unwrap()

auto base = "http://127.0.0.1:8768"
auto form = {"Content-Type": "application/x-www-form-urlencoded"}
auto login = requests.post(base ++ "/login", {body: "name=Ada+Lovelace", headers: form}).unwrap()
log login.body
log login.headers["Set-Cookie"]
auto who = requests.get(base ++ "/whoami", {headers: {Cookie: "user=Ada"}}).unwrap()
log who.body
log requests.get(base ++ "/whoami").unwrap().body

app.stop().unwrap()
```

```output
hello Ada Lovelace
user="Ada Lovelace"; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax
Ada
nobody
```

`requests` doesn't keep cookies between calls, so the example sends the `Cookie` header itself. A browser would do that for you.

## Templates

`app.views(dir)` names a folder of `.html` views and `c.render(name, data)` fills one in, escaping every value. `app.layout(name)` wraps each page in a shared layout, which receives the page as `body`. Views use the syntax of [template](template.md):

```osl
import "std:serve"
import "std:requests"
import "std:fs"

fs.remove("site", {force: true}).unwrap()
fs.mkdir("site/views", {recursive: true}).unwrap()
fs.writeFile("site/views/layout.html", "<main>{{& body}}</main>").unwrap()
fs.writeFile("site/views/hello.html", "<h1>Hello {{ name }}</h1>").unwrap()

auto app = serve.new()
app.views("site/views").layout("layout")

app.get("/hello/:name", def(*serve.Context c) (
  c.render("hello", {name: c.param("name")})
))
app.start("127.0.0.1:8769").unwrap()

auto r = requests.get("http://127.0.0.1:8769/hello/%3CAda%3E").unwrap()
log r.headers["Content-Type"]
log r.body

app.stop().unwrap()
fs.remove("site", {force: true}).unwrap()
```

```output
text/html; charset=utf-8
<main><h1>Hello &lt;Ada&gt;</h1></main>
```

The name arrived as `<Ada>` and came out escaped, which is what stops user input becoming markup. Write `{{& value}}` only for HTML you built yourself, as the layout does for `body`.

## Static files

`app.static(prefix, dir)` serves a directory. Paths that escape it, dotfiles and directories without an `index.html` answer 404 unless you opt in with the `dotfiles` and `listing` options. `app.staticFile(path, file)` serves one file at one path:

```osl
import "std:serve"
import "std:requests"
import "std:fs"

fs.remove("public", {force: true}).unwrap()
fs.mkdir("public").unwrap()
fs.writeFile("public/app.css", "body { margin: 0 }").unwrap()
fs.writeFile("public/.secret", "hidden").unwrap()

auto app = serve.new()
app.static("/assets", "public")
app.start("127.0.0.1:8770").unwrap()

auto base = "http://127.0.0.1:8770/assets"
auto css = requests.get(base ++ "/app.css").unwrap()
log css.status css.headers["Content-Type"] css.body
log requests.get(base ++ "/missing.css").unwrap().status
log requests.get(base ++ "/.secret").unwrap().status

app.stop().unwrap()
fs.remove("public", {force: true}).unwrap()
```

```output
200 text/css; charset=utf-8 body { margin: 0 }
404
404
```

## Serving in the background

`run` blocks, so to serve and do something else in one program start the server inside an async function and keep the thread. This is how a program can run an API and a worker side by side:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/ping", def(*serve.Context c) (
  c.text(200, "pong")
))

async serveApp() result<unit, error> (
  return app.run("127.0.0.1:8771")
)

auto server = serveApp()
thread.sleep(300)
log requests.get("http://127.0.0.1:8771/ping").unwrap().body

app.stop().unwrap()
log server.wait().isOk()
```

```output
pong
true
```

The sleep gives the thread time to start listening. When you don't need the thread, `app.start(...)` does the same with no waiting.

## WebSockets and live pages

`app.ws(path, server)` mounts a [ws](ws.md) server on a route, so one router serves pages and sockets on the same port. `app.ui(path, target)` shows a [ui](ui.md) interface that updates live. Both go through the same middleware as ordinary routes.

:::exercise title="A greeting endpoint"
Add `POST /greet`. It takes JSON like `{"name": "Ada"}` and answers 200 with `{"message": "Hello, Ada!"}`. When `name` is missing or empty it answers 400 with a message of your choice. The program already calls it three times.

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

// add your route here

app.start("127.0.0.1:8772").unwrap()

auto url = "http://127.0.0.1:8772/greet"
for body in [{name: "Ada"}, {name: ""}, {other: 1}] (
  auto r = requests.post(url, {json: body}).unwrap()
  log r.status r.body.trim()
)

app.stop().unwrap()
```

```output
200 {"message":"Hello, Ada!"}
400 {"error":"name is required"}
400 {"error":"name is required"}
```

> [!hint]
> `c.bodyJSON().unwrap()` gives an object. Read a field with `data["name"]`, and `?? ""` covers a missing one.

> [!hint]
> `c.badRequest(message)` answers 400 and ends the chain. Put `return` after it.

```osl solution
import "std:serve"
import "std:requests"

auto app = serve.new()

app.post("/greet", def(*serve.Context c) (
  auto data = c.bodyJSON().unwrap()
  string name = data["name"] ?? ""
  if name == "" (
    c.badRequest("name is required")
    return
  )
  c.json(200, {message: "Hello, " ++ name ++ "!"})
))

app.start("127.0.0.1:8772").unwrap()

auto url = "http://127.0.0.1:8772/greet"
for body in [{name: "Ada"}, {name: ""}, {other: 1}] (
  auto r = requests.post(url, {json: body}).unwrap()
  log r.status r.body.trim()
)

app.stop().unwrap()
```

```output
200 {"message":"Hello, Ada!"}
400 {"error":"name is required"}
400 {"error":"name is required"}
```
:::

:::quiz
A middleware handler checks a token and finds it invalid. It calls `c.unauthorized("no")` and does not call `c.next()`. What happens to the route's own handler?

- [ ] It runs anyway.
- [x] It never runs: the chain stopped at the middleware.
- [ ] It runs, but with an empty body.

Calling `c.next()` is what passes the request on.
:::

:::quiz
`app.get("/users/:id", ...)` receives `/users/42`. What is `c.param("id")`?

- [ ] The number `42`.
- [x] The string `"42"`.
- [ ] `null`.

Path parameters are strings. `c.paramInt("id", 0)` converts, and returns a result.
:::

:::exercise title="A visit counter"
Add `GET /visit`. Each call answers with how many times it has been called so far, as plain text.

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()

// add your route here

app.start("127.0.0.1:8773").unwrap()

for _ in 1 to 3 (
  log requests.get("http://127.0.0.1:8773/visit").unwrap().body
)

app.stop().unwrap()
```

```output
1
2
3
```

> [!hint]
> Keep the count in a variable outside the handler: `int visits = 0`.

> [!hint]
> Inside the handler, `visits = visits + 1` then `c.text(200, "" ++ visits)`.

```osl solution
import "std:serve"
import "std:requests"

auto app = serve.new()
int visits = 0

app.get("/visit", def(*serve.Context c) (
  visits = visits + 1
  c.text(200, "" ++ visits)
))

app.start("127.0.0.1:8773").unwrap()

for _ in 1 to 3 (
  log requests.get("http://127.0.0.1:8773/visit").unwrap().body
)

app.stop().unwrap()
```

```output
1
2
3
```
:::

## API reference

::api
