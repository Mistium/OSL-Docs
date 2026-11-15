---
layout: project
description: Build Shorty, a link shortener with a JSON API, redirects, validation, visit counts and a token-protected route group.
uses: serve, requests, result
time: 25 minutes
---

# Build a web API

You'll build Shorty: post a long URL, get back a short code, and visiting the code redirects to the URL. Along the way you'll use routes, path parameters, JSON bodies, status codes, validation, middleware and route groups.

Servers run forever, so each step starts the router in the try-it tab with `app.start`, calls it with `std:requests`, prints the answer and stops it.

## Answer a request

`serve.new()` makes a router and `app.get(path, handler)` adds a route. A handler gets a `*serve.Context`, which holds the request and is how you answer: `c.text(status, body)` sends text. A path with no route gets a 404 from the router.

```osl
import "std:serve"
import "std:requests"

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8720"
app.start("127.0.0.1:8720").unwrap()

auto r = requests.get(base ++ "/health").unwrap()
show(r.status, r.body)
r = requests.get(base ++ "/nothing").unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
200 Shorty is running
404 404 page not found
```

**Try changing** the text, or the status number.

## Create a link

`POST /links` reads the JSON body into a `NewLink` with `c.bindJSON`, picks a code, remembers the URL in a map and answers `201` (created) with `c.json`. Handlers run on several threads at once, and this shared map has no lock, so a real service would guard it. The [concurrency lesson](../learn/concurrency.md) shows how.

```osl
import "std:serve"
import "std:requests"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.post("/links", def(*serve.Context c) (
  NewLink input = NewLink()
  c.bindJSON(input).unwrap()
  made += 1
  string code = "l" ++ made
  Link link = Link()
  link.url = input.url
  links[code] = link
  c.json(201, {code: code, url: input.url})
))

// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8721"
app.start("127.0.0.1:8721").unwrap()

auto r = requests.post(base ++ "/links", {json: {url: "https://osl-lang.org"}}).unwrap()
show(r.status, r.body)
r = requests.post(base ++ "/links", {json: {url: "https://rotur.dev"}}).unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
201 {"code":"l1","url":"https://osl-lang.org"}
201 {"code":"l2","url":"https://rotur.dev"}
```

:::exercise title="Four-digit codes"
Make `codeFor` return `l0007` for 7 and `l0042` for 42.

```osl
def codeFor(int n) string (
  return "l" ++ n
)

log codeFor(7)
log codeFor(42)
```

```output
l0007
l0042
```

> [!hint]
> Turn `n` into text first, then repeat `"0"` as many times as it's short of 4: `"0" * 2`.

```osl solution
def codeFor(int n) string (
  string digits = "" ++ n
  return "l" ++ ("0" * (4 - digits.len)) ++ digits
)

log codeFor(7)
log codeFor(42)
```
:::


## Follow a link

`/:code` matches one path segment, and `c.param("code")` reads it. Known codes get `c.redirect(302, url)`. Unknown ones get `c.notFound(message)`, which answers 404 with a JSON error. The try-it tab asks `requests` not to follow the redirect, so we can see it.

```osl
import "std:serve"
import "std:requests"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.post("/links", def(*serve.Context c) (
  NewLink input = NewLink()
  c.bindJSON(input).unwrap()
  made += 1
  string code = "l" ++ made
  Link link = Link()
  link.url = input.url
  links[code] = link
  c.json(201, {code: code, url: input.url})
))

app.get("/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  c.redirect(302, links[code].url)
))


// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8722"
app.start("127.0.0.1:8722").unwrap()

requests.post(base ++ "/links", {json: {url: "https://osl-lang.org"}}).unwrap()

auto r = requests.get(base ++ "/l1", {redirects: false}).unwrap()
show(r.status, "goes to " ++ r.headers["Location"])
r = requests.get(base ++ "/l9").unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
302 goes to https://osl-lang.org
404 {"error":"no such link"}
```

:::quiz
Why does Shorty redirect with 302, not 301?

- [ ] 302 is faster.
- [x] 301 means moved forever, so browsers may remember it and never ask Shorty again.
- [ ] 301 isn't allowed for GET.

A permanent redirect gets cached. With 302 every visit reaches the server, which matters once you count visits or let links change.
:::

:::exercise title="Add an about route"
Add `GET /about` that answers 200 with `Shorty shortens links`.

```osl
import "std:serve"
import "std:requests"

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

// add /about here

app.start("127.0.0.1:8723").unwrap()
auto r = requests.get("http://127.0.0.1:8723/about").unwrap()
string body = r.body
log r.status body.trim()
app.stop().unwrap()
```

```output
200 Shorty shortens links
```

> [!hint]
> Copy the `/health` route and change the path and text.

```osl solution
import "std:serve"
import "std:requests"

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.get("/about", def(*serve.Context c) (
  c.text(200, "Shorty shortens links")
))

app.start("127.0.0.1:8724").unwrap()
auto r = requests.get("http://127.0.0.1:8724/about").unwrap()
string body = r.body
log r.status body.trim()
app.stop().unwrap()
```
:::


## Reject bad links

`bindJSON` checks the *shape* of the body, not whether the values make sense. Put the rules in a function that returns a `result` and `switch` on it: a good URL is stored, a bad one gets `422`. Broken JSON is rejected with a 400 before your code runs. See [errors](../learn/errors.md).

```osl
import "std:serve"
import "std:requests"
import "std:result"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

def validate(NewLink input) result<NewLink, error> (
  if !input.url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  return result.ok(input)
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.post("/links", def(*serve.Context c) (
  NewLink input = NewLink()
  c.bindJSON(input).unwrap()
  switch validate(input) (
    case ok(good)
      made += 1
      string code = "l" ++ made
      Link link = Link()
      link.url = good.url
      links[code] = link
      c.json(201, {code: code, url: good.url})
    case err(e)
      c.json(422, {error: e.message})
  )
))

app.get("/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  c.redirect(302, links[code].url)
))



// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8725"
app.start("127.0.0.1:8725").unwrap()

auto r = requests.post(base ++ "/links", {json: {url: "https://osl-lang.org"}}).unwrap()
show(r.status, r.body)
r = requests.post(base ++ "/links", {json: {url: "javascript:alert(1)"}}).unwrap()
show(r.status, r.body)
r = requests.post(base ++ "/links", {body: "not json"}).unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
201 {"code":"l1","url":"https://osl-lang.org"}
422 {"error":"url must start with http"}
400 {"error":"the request body is not valid JSON for the target: invalid character 'o' in literal null (expecting 'u')"}
```

:::exercise title="Reject spaces"
Also reject URLs containing a space, with the message `url must not contain spaces`.

```osl
import "std:result"

def validate(string url) result<string, error> (
  if !url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  return result.ok(url)
)

for url in ["https://osl-lang.org", "ftp://files", "http://a b"] (
  switch validate(url) (
    case ok(u)
      log "ok " ++ u
    case err(e)
      log "error: " ++ e.message
  )
)
```

```output
ok https://osl-lang.org
error: url must start with http
error: url must not contain spaces
```

> [!hint]
> `url.contains(" ")`, then return another `result.err`.

```osl solution
import "std:result"

def validate(string url) result<string, error> (
  if !url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  if url.contains(" ") (
    return result.err(error("url must not contain spaces"))
  )
  return result.ok(url)
)

for url in ["https://osl-lang.org", "ftp://files", "http://a b"] (
  switch validate(url) (
    case ok(u)
      log "ok " ++ u
    case err(e)
      log "error: " ++ e.message
  )
)
```
:::


## Count visits

The redirect now adds one to the link's `hits`, and `GET /links/:code` reports them. Put the stats route before `/:code`: `/links/l1` has two segments, so it can't clash, but keeping specific routes first is a good habit.

```osl
import "std:serve"
import "std:requests"
import "std:result"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

def validate(NewLink input) result<NewLink, error> (
  if !input.url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  return result.ok(input)
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.post("/links", def(*serve.Context c) (
  NewLink input = NewLink()
  c.bindJSON(input).unwrap()
  switch validate(input) (
    case ok(good)
      made += 1
      string code = "l" ++ made
      Link link = Link()
      link.url = good.url
      links[code] = link
      c.json(201, {code: code, url: good.url})
    case err(e)
      c.json(422, {error: e.message})
  )
))

app.get("/links/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  c.json(200, {url: links[code].url, hits: links[code].hits})
))

app.get("/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  links[code].hits += 1
  c.redirect(302, links[code].url)
))




// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8726"
app.start("127.0.0.1:8726").unwrap()

requests.post(base ++ "/links", {json: {url: "https://osl-lang.org"}}).unwrap()
requests.get(base ++ "/l1", {redirects: false}).unwrap()
requests.get(base ++ "/l1", {redirects: false}).unwrap()

auto r = requests.get(base ++ "/links/l1").unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
200 {"hits":2,"url":"https://osl-lang.org"}
```

:::exercise title="Say it nicely"
Make `visits` say `no visits`, `1 visit`, or `5 visits`.

```osl
def visits(int n) string (
  return n ++ " visits"
)

log visits(0)
log visits(1)
log visits(5)
```

```output
no visits
1 visit
5 visits
```

> [!hint]
> Early `return`s for 0 and 1.

```osl solution
def visits(int n) string (
  if n == 0 return "no visits"
  if n == 1 return "1 visit"
  return n ++ " visits"
)

log visits(0)
log visits(1)
log visits(5)
```
:::


## Protect the API with a group

Anyone may follow a link, but only the owner should create them. `app.group("/api", setup)` makes a group: its routes get the `/api` prefix, and middleware added with `g.use` applies only inside it. `serve.requireBearer("secret")` answers 401 without the right `Authorization: Bearer secret` header. A middleware on `app.use` runs first for everything and calls `c.next()` to pass the request on.

```osl
import "std:serve"
import "std:requests"
import "std:result"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

def validate(NewLink input) result<NewLink, error> (
  if !input.url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  return result.ok(input)
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.use(def(*serve.Context c) (
  c.setHeader("X-Powered-By", "shorty")
  c.next()
))

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.group("/api", def(*serve.Router g) (
  g.use(serve.requireBearer("secret"))

  g.post("/links", def(*serve.Context c) (
    NewLink input = NewLink()
    c.bindJSON(input).unwrap()
    switch validate(input) (
      case ok(good)
        made += 1
        string code = "l" ++ made
        Link link = Link()
        link.url = good.url
        links[code] = link
        c.json(201, {code: code, url: good.url})
      case err(e)
        c.json(422, {error: e.message})
    )
  ))

  g.get("/links/:code", def(*serve.Context c) (
    string code = c.param("code")
    if !links.contains(code) (
      c.notFound("no such link")
      return
    )
    c.json(200, {url: links[code].url, hits: links[code].hits})
  ))
))

app.get("/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  links[code].hits += 1
  c.redirect(302, links[code].url)
))





// try it
def show(int status, string body) (
  string text = body.trim()
  if text == "" (
    log status
  ) else (
    log status text
  )
)

string base = "http://127.0.0.1:8727"
app.start("127.0.0.1:8727").unwrap()

auto key = {headers: {Authorization: "Bearer secret"}}
auto r = requests.post(base ++ "/api/links", {json: {url: "https://osl-lang.org"}}).unwrap()
show(r.status, r.body)
r = requests.post(base ++ "/api/links", {headers: {Authorization: "Bearer secret"}, json: {url: "https://osl-lang.org"}}).unwrap()
show(r.status, r.body)
r = requests.get(base ++ "/l1", {redirects: false}).unwrap()
show(r.status, r.headers["X-Powered-By"])
r = requests.get(base ++ "/api/links/l1", key).unwrap()
show(r.status, r.body)
app.stop().unwrap()
```

```output
401 {"error":"unauthorized"}
201 {"code":"l1","url":"https://osl-lang.org"}
302 shorty
200 {"hits":1,"url":"https://osl-lang.org"}
```

:::quiz
A request to `/api/links` has no token. What does the client see?

- [ ] A 404.
- [x] A 401 that still has the `X-Powered-By` header.
- [ ] The link list.

The first middleware runs for every request and calls `c.next()`. The group's bearer check then answers 401, and the header it set is already on the response.
:::

## Run it for real

The try-it tab replaced `app.run`. For real, finish with `app.run(":8080")`, which serves until the program stops. This is the program you'd save as `shorty.osl`.

```osl norun
import "std:serve"
import "std:requests"
import "std:result"

class Link (
  string url = ""
  int hits = 0
)

class NewLink (
  string url = ""
)

def validate(NewLink input) result<NewLink, error> (
  if !input.url.startsWith("http") (
    return result.err(error("url must start with http"))
  )
  return result.ok(input)
)

map<string, Link> links = {}
int made = 0

*serve.Router app = serve.new()

app.use(def(*serve.Context c) (
  c.setHeader("X-Powered-By", "shorty")
  c.next()
))

app.get("/health", def(*serve.Context c) (
  c.text(200, "Shorty is running")
))

app.group("/api", def(*serve.Router g) (
  g.use(serve.requireBearer("secret"))

  g.post("/links", def(*serve.Context c) (
    NewLink input = NewLink()
    c.bindJSON(input).unwrap()
    switch validate(input) (
      case ok(good)
        made += 1
        string code = "l" ++ made
        Link link = Link()
        link.url = good.url
        links[code] = link
        c.json(201, {code: code, url: good.url})
      case err(e)
        c.json(422, {error: e.message})
    )
  ))

  g.get("/links/:code", def(*serve.Context c) (
    string code = c.param("code")
    if !links.contains(code) (
      c.notFound("no such link")
      return
    )
    c.json(200, {url: links[code].url, hits: links[code].hits})
  ))
))

app.get("/:code", def(*serve.Context c) (
  string code = c.param("code")
  if !links.contains(code) (
    c.notFound("no such link")
    return
  )
  links[code].hits += 1
  c.redirect(302, links[code].url)
))






log "Shorty is listening on http://localhost:8080"
app.run(":8080").unwrap()
```

Try it with `curl -H "Authorization: Bearer secret" -d '{"url":"https://osl-lang.org"}' localhost:8080/api/links`. Links vanish on restart: keep them in [db](../packages/db.md) (`db.open`, `createTable`, `insert`) by replacing the map with three small functions. Next: [realtime chat](realtime-chat.md), or the [serve](../packages/serve.md) and [requests](../packages/requests.md) pages.
