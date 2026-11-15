---
description: Send HTTP requests and read responses as text, typed JSON, lines or server-sent events, with timeouts and honest error handling.
package: requests
---

# requests

`std:requests` is the HTTP client. Use it to call web APIs, download pages, post data and read streaming responses. It is the counterpart of [serve](serve.md), and the examples here call a small server they start themselves on `127.0.0.1`, so every one runs as written. Replace the local address with a real URL in your own code.

## A first request

`requests.get(url)` returns a result. On success you get a response with `status`, `ok`, `statusText`, `url`, `headers` and `body`:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/hello", def(*serve.Context c) (
  c.setHeader("X-Served-By", "osl")
  c.text(200, "Hello, client")
))
app.start("127.0.0.1:8790").unwrap()

auto reply = requests.get("http://127.0.0.1:8790/hello").unwrap()
log reply.status reply.statusText
log reply.ok
log reply.headers["X-Served-By"]
log reply.body

app.stop().unwrap()
```

```output
200 OK
true
osl
Hello, client
```

Try a path the server doesn't have, such as `/nothing`, and look at `status` and `ok`.

Header names use their canonical capitalisation, such as `Content-Type` and `X-Served-By`, whatever the server sent.

## Other methods

Each HTTP method has a function: `get`, `post`, `put`, `patch`, `delete`, `head` and `options`. All take a URL and an optional options object. The `json` option encodes a value as the request body and sets `Content-Type: application/json`. The `body` option sends a string as it is:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.post("/items", def(*serve.Context c) (
  auto item = c.bodyJSON().unwrap()
  c.json(201, {id: 1, name: item["name"]})
))
app.put("/items/:id", def(*serve.Context c) (
  c.text(200, "replaced " ++ c.param("id") ++ " with " ++ c.body())
))
app.delete("/items/:id", def(*serve.Context c) (
  c.noContent()
))
app.start("127.0.0.1:8791").unwrap()

auto base = "http://127.0.0.1:8791/items"
auto made = requests.post(base, {json: {name: "lamp"}}).unwrap()
log made.status made.body.trim()
auto put = requests.put(base ++ "/1", {body: "plain text"}).unwrap()
log put.status put.body
auto gone = requests.delete(base ++ "/1").unwrap()
log gone.status gone.body.len

app.stop().unwrap()
```

```output
201 {"id":1,"name":"lamp"}
200 replaced 1 with plain text
204 0
```

## Query strings and headers

The `query` option adds parameters to the URL and escapes them. `headers` sets request headers, which is where tokens go:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/search", def(*serve.Context c) (
  c.json(200, {
    q: c.query("q"),
    auth: c.bearer(),
    agent: c.userAgent()
  })
))
app.start("127.0.0.1:8792").unwrap()

auto reply = requests.get("http://127.0.0.1:8792/search", {
  query: {q: "hello world, osl"},
  headers: {Authorization: "Bearer abc123", "User-Agent": "docs/1.0"}
}).unwrap()
log reply.url
log reply.body.trim()

app.stop().unwrap()
```

```output
http://127.0.0.1:8792/search?q=hello+world%2C+osl
{"agent":"docs/1.0","auth":"abc123","q":"hello world, osl"}
```

## Typed JSON responses

Most APIs answer with JSON. `.parse<T>()` on a response (or on the result of a request) parses the body and checks it against a type, so a wrong shape is an error and not a surprise later. It needs `std:json` no more than you do:

```osl
import "std:serve"
import "std:requests"

struct User (
  string name = ""
  int age = 0
)

auto app = serve.new()
app.get("/user", def(*serve.Context c) (
  c.json(200, {name: "Ada", age: 36})
))
app.get("/broken", def(*serve.Context c) (
  c.json(200, {name: "Ada", age: "old"})
))
app.start("127.0.0.1:8793").unwrap()

auto base = "http://127.0.0.1:8793"
User user = requests.get(base ++ "/user").parse<User>().unwrap()
log user.name user.age

auto bad = requests.get(base ++ "/broken").parse<User>()
log bad.isErr() bad.unwrapErr().kind

app.stop().unwrap()
```

```output
Ada 36
true ParseError
```

`parse` sits on the request's result, so it also passes a failed request through: one `unwrap` or `catch` at the end covers both the network and the parsing.

## A bad status is not a failure

A request fails only when no response arrives: the host is down, the connection times out or the URL is malformed. A 404 or 500 is a successful request with `ok` set to false. Check it yourself:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/missing", def(*serve.Context c) (
  c.notFound("no such thing")
))
app.start("127.0.0.1:8794").unwrap()

auto reply = requests.get("http://127.0.0.1:8794/missing").unwrap()
log reply.ok reply.status
log reply.body.trim()

if !reply.ok (
  log "the server said no"
)

app.stop().unwrap()
```

```output
false 404
{"error":"no such thing"}
the server said no
```

## Failures that are failures

When no response arrives, you get an error whose `kind` says why: `NetworkError` (refused or reset), `NotFoundError` (unknown host), `TimeoutError`, `ParseError` (malformed URL), `UnsupportedError` (a scheme other than http and https) or `IOError` (a body over `maxBytes`). The `timeoutMs` option sets the limit and defaults to 30 seconds:

```osl
import "std:serve"
import "std:requests"
import "std:thread"

auto app = serve.new()
app.get("/slow", def(*serve.Context c) (
  thread.sleep(500)
  c.text(200, "finally")
))
app.start("127.0.0.1:8795").unwrap()

auto slow = requests.get("http://127.0.0.1:8795/slow", {timeoutMs: 100})
log slow.isErr() slow.unwrapErr().kind

auto closed = requests.get("http://127.0.0.1:1/")
log closed.unwrapErr().kind

auto odd = requests.get("gopher://example.com/")
log odd.unwrapErr().kind

switch requests.get("http://127.0.0.1:8795/slow", {timeoutMs: 2000}) (
  case ok(r)
    log "got" r.body
  case err(e)
    log "failed:" e.kind
)

app.stop().unwrap()
```

```output
true TimeoutError
NetworkError
UnsupportedError
got finally
```

## Retrying

Networks fail in passing ways, so retry the ones worth retrying. [retry](retry.md) calls a function again, with a growing delay, until it succeeds. The function fails by throwing or returning a failed result, so turn a bad status into an error:

```osl
import "std:serve"
import "std:requests"
import "std:retry"

auto app = serve.new()
int hits = 0
app.get("/flaky", def(*serve.Context c) (
  hits = hits + 1
  if hits < 3 (
    c.internalError("not yet")
    return
  )
  c.text(200, "worked on try " ++ hits)
))
app.start("127.0.0.1:8796").unwrap()

auto body = retry.call(def(int attempt) (
  auto r = requests.get("http://127.0.0.1:8796/flaky").unwrap()
  if !r.ok (
    throw error("status " ++ r.status ++ " on attempt " ++ attempt)
  )
  return r.body
), {attempts: 5, delay: 10}).unwrap()
log body

app.stop().unwrap()
```

```output
worked on try 3
```

Retry only requests that are safe to repeat. A `GET` is. A `POST` that charges a card needs an idempotency key first.

## Redirects and size limits

Redirects are followed by default. Pass `redirects: false` to receive the redirect itself, which is how you read a `Location` header. `maxBytes` (16 MiB by default) stops a server from sending you more than you want to hold:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/old", def(*serve.Context c) (
  c.redirect(301, "/new")
))
app.get("/new", def(*serve.Context c) (
  c.text(200, "the new page")
))
app.get("/big", def(*serve.Context c) (
  c.text(200, "x" * 5000)
))
app.start("127.0.0.1:8797").unwrap()

auto base = "http://127.0.0.1:8797"
auto followed = requests.get(base ++ "/old").unwrap()
log followed.status followed.url followed.body
auto raw = requests.get(base ++ "/old", {redirects: false}).unwrap()
log raw.status raw.headers["Location"]

auto big = requests.get(base ++ "/big", {maxBytes: 1000})
log big.unwrapErr().kind

app.stop().unwrap()
```

```output
200 http://127.0.0.1:8797/new the new page
301 /new
IOError
```

## Streaming lines

`requests.get` reads the whole body before returning. For a large download, or a server that keeps sending, use `requests.stream(method, url, options)`. It returns as soon as the headers arrive, and `stream.lines()` yields each line as it comes in. Close the stream when you are done:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/log", def(*serve.Context c) (
  c.text(200, "starting\nworking\ndone\n")
))
app.start("127.0.0.1:8798").unwrap()

auto stream = requests.stream("GET", "http://127.0.0.1:8798/log").unwrap()
log stream.status() stream.ok()
for line in stream.lines() (
  log "line:" line
)
stream.close().unwrap()

app.stop().unwrap()
```

```output
200 true
line: starting
line: working
line: done
```

A stream with an error status is still a stream: check `stream.ok()` before reading. The `timeoutMs` of a stream defaults to no limit and covers reading the body, so set one if the server might go quiet.

## Server-sent events

A server that answers with `text/event-stream` pushes events over one response, as many AI and live-update APIs do. `stream.events()` yields each as `{event, data, id}`. The event name is `message` unless the server names one:

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/events", def(*serve.Context c) (
  c.send(200, "text/event-stream", "event: tick\ndata: 1\n\ndata: 2\nid: 7\n\ndata: [DONE]\n\n")
))
app.start("127.0.0.1:8799").unwrap()

auto stream = requests.stream("GET", "http://127.0.0.1:8799/events").unwrap()
for e in stream.events() (
  if e.data == "[DONE]" break
  log e.event e.data e.id
)
stream.close().unwrap()

app.stop().unwrap()
```

```output
tick 1 
message 2 7
```

A sentinel such as `[DONE]` comes through as an ordinary event, so end the loop yourself when you see it.

## Many requests at once

An async function runs on its own thread, so several requests can be in flight together. `waitAll` collects the results in order:

```osl norun
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/n/:n", def(*serve.Context c) (
  thread.sleep(100)
  c.text(200, "item " ++ c.param("n"))
))
app.start("127.0.0.1:8789").unwrap()

async fetch(int n) string (
  return requests.get("http://127.0.0.1:8789/n/" ++ n).unwrap().body
)

auto jobs = [fetch(1), fetch(2), fetch(3)]
for body in thread.waitAll(jobs) (
  log body
)

app.stop().unwrap()
```

```output
item 1
item 2
item 3
```

Three sleeping requests finish in about the time of one.

> [!note]
> This example is not run by the docs checker: calling `requests.get` from several threads at once sometimes fails with `json: unsupported type: func() (io.ReadCloser, error)` in OSL 9.2.0. If you hit it, make the calls one after another until it is fixed.

:::exercise title="Fetch and total"
The server lists prices at `/prices` as a JSON array of numbers. Fetch it with `parse<number[]>()`, then print how many prices there are and their total. Treat a failed request as zero prices and print a message instead of crashing.

```osl
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/prices", def(*serve.Context c) (
  c.json(200, [3.5, 1.25, 10])
))
app.start("127.0.0.1:8788").unwrap()

// fetch and print here

app.stop().unwrap()
```

```output
3 prices, total 14.75
```

> [!hint]
> `requests.get(url).parse<number[]>()` is a result: use `switch` with `ok` and `err` cases.

> [!hint]
> `prices.sum()` adds an array, and `prices.len` counts it.

```osl solution
import "std:serve"
import "std:requests"

auto app = serve.new()
app.get("/prices", def(*serve.Context c) (
  c.json(200, [3.5, 1.25, 10])
))
app.start("127.0.0.1:8788").unwrap()

number[] prices = []
switch requests.get("http://127.0.0.1:8788/prices").parse<number[]>() (
  case ok(list)
    prices = list
  case err(e)
    log "could not load prices:" e.message
)
log prices.len ++ " prices, total " ++ prices.sum()

app.stop().unwrap()
```

```output
3 prices, total 14.75
```
:::

:::quiz
A server answers `404 Not Found`. What does `requests.get(url)` return?

- [ ] A failed result.
- [x] A successful result whose response has `ok` false and `status` 404.
- [ ] `null`.

A request fails only when no response arrives at all.
:::

:::exercise title="Add two numbers remotely"
The server adds two numbers: `POST /add` with `{"a": 2, "b": 3}` answers `{"sum": 5}`. Post those numbers, parse the answer into the `Sum` struct and print the sum.

```osl
import "std:serve"
import "std:requests"

struct Sum (
  int sum = 0
)

class Pair (
  int a = 0
  int b = 0
)

auto app = serve.new()
app.post("/add", def(*serve.Context c) (
  Pair p = Pair()
  c.bindJSON(p).unwrap()
  c.json(200, {sum: p.a + p.b})
))
app.start("127.0.0.1:8776").unwrap()

log "?"

app.stop().unwrap()
```

```output
5
```

> [!hint]
> `requests.post(url, {json: {a: 2, b: 3}})` returns a result.

> [!hint]
> `.parse<Sum>().unwrap()` turns the response body into a `Sum`.

```osl solution
import "std:serve"
import "std:requests"

struct Sum (
  int sum = 0
)

class Pair (
  int a = 0
  int b = 0
)

auto app = serve.new()
app.post("/add", def(*serve.Context c) (
  Pair p = Pair()
  c.bindJSON(p).unwrap()
  c.json(200, {sum: p.a + p.b})
))
app.start("127.0.0.1:8776").unwrap()

Sum answer = requests.post("http://127.0.0.1:8776/add", {json: {a: 2, b: 3}}).parse<Sum>().unwrap()
log answer.sum

app.stop().unwrap()
```

```output
5
```
:::

## API reference

::api
