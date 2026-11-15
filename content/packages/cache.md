---
description: Keep recent results in memory with a size limit and an expiry time, so slow work is done once.
package: cache
---

# cache

`std:cache` is an in-memory key-value store that forgets on purpose. It holds at most a set number of entries and drops the least recently used one when it is full, and each entry can expire after a time to live. Use it to avoid repeating slow work: a network lookup, a rendered page, a heavy calculation. A cache lives only as long as the program, so use [save](save.md) or [db](db.md) for data that must survive.

## Set and get

`cache.new()` makes a cache. `set(key, value)` stores any value under a string key, and `get(key)` returns it, or `null` when there is nothing live under that key:

```osl
import "std:cache"

auto items = cache.new()
items.set("a", 1)
items.set("b", "two")
items.set("list", [3, 4])

log items.get("a") items.get("b") items.get("list")
log items.get("missing")
log items.size() items.has("a") items.has("missing")
log items.delete("a") items.delete("a")
log items.size()
```

```output
1 two [3,4]
null
3 true false
true false
2
```

`has` tells a missing key from one that holds `null`. `delete` returns whether it removed something, and `clear()` empties the cache.

## Limiting the size

The `capacity` option caps how many entries the cache holds. Reading or writing an entry marks it as recently used, and a new entry in a full cache pushes out the one used longest ago:

```osl
import "std:cache"

auto recent = cache.new({capacity: 2})
recent.set("a", 1)
recent.set("b", 2)
recent.get("a")
recent.set("c", 3)

log recent.keys().sort()
log recent.has("b")
log recent.info()
```

```output
["a","c"]
false
{"capacity":2,"size":2,"ttl":300000}
```

Reading `a` made `b` the oldest, so `b` was the one dropped. The `ttl` in `info()` is the default lifetime of an entry: 300000 milliseconds, five minutes. The default `capacity` is 100.

## Expiry

The `ttl` option, in milliseconds, makes entries expire. `set` also takes a `ttl` of its own for one entry. `ttl(key)` says how long is left, or `null` for a key that isn't there. Expired entries behave as if they were never stored:

```osl
import "std:cache"
import "std:thread"

auto c = cache.new({ttl: 100})
c.set("short", "soon gone")
c.set("long", "stays", {ttl: 60000})

log c.has("short") (c.ttl("short") ?? 0) > 0
thread.sleep(200)
log c.has("short") c.get("short")
log c.get("long")
log c.ttl("missing")

c.expire("long", 50)
thread.sleep(100)
log c.has("long")
```

```output
true true
false null
stays
null
false
```

`expire(key, ms)` gives a live entry a new lifetime. Expired entries are removed when next touched, or all at once with `cleanupExpired()`.

## Fetch: compute once

`fetch(key, loader)` is the call you will use most. It returns the live value under `key`, and when there is none it calls `loader()`, stores the answer and returns it. The loader runs only on a miss:

```osl
import "std:cache"

auto squares = cache.new()
int runs = 0

def slowSquare() int (
  runs = runs + 1
  return 12 * 12
)

log squares.fetch("12", slowSquare)
log squares.fetch("12", slowSquare)
log squares.fetch("12", slowSquare)
log "computed" runs "time"
```

```output
144
144
144
computed 1 time
```

## Caching a server's answers

Here a handler counts how often it does real work, and a cache with a short life sits in front of it. The first request is a miss, the next is served from the cache, and an expired entry is computed again:

```osl norun
import "std:serve"
import "std:requests"
import "std:cache"
import "std:thread"

auto app = serve.new()
auto pages = cache.new({capacity: 100, ttl: 300})
int renders = 0

def render() string (
  renders = renders + 1
  return "report #" ++ renders
)

app.get("/report", def(*serve.Context c) (
  c.text(200, pages.fetch("report", render))
))
app.start("127.0.0.1:8777").unwrap()

for _ in 1 to 2 (
  log requests.get("http://127.0.0.1:8777/report").unwrap().body
)
thread.sleep(400)
log requests.get("http://127.0.0.1:8777/report").unwrap().body

app.stop().unwrap()
```

It prints `report #1` twice and then `report #2`. The cache is safe to use from several threads at once, so handlers can share one.

> [!note]
> `fetch` doesn't stop two simultaneous misses from both running the loader. If the work must happen once even then, guard it with a lock from [sync](sync.md).

## Looking inside

A cache can be read as a whole: `keys()`, `values()`, `entries()` (an object), `toArray()` (with each entry's expiry time), and `forEach`, `filter` and `mapValues`, which call your function with `(key, value)`, and `reduce`, which calls it with `(result, value)`:

```osl
import "std:cache"

auto stock = cache.new()
stock.setMany({apples: 3, pears: 0, plums: 7})

log stock.entries()
log stock.pick(["apples", "kiwis"])
log stock.filter(def(string key, any value) boolean -> value > 0)
log stock.reduce(0, def(any total, any value) any -> total + value)
```

```output
{"apples":3,"pears":0,"plums":7}
{"apples":3}
{"apples":3,"plums":7}
10
```

:::quiz
A cache has `capacity: 2` and holds `a` and `b`. You read `a`, then store `c`. Which key is dropped?

- [ ] `a`, because it is the oldest.
- [x] `b`, the least recently used.
- [ ] None. The cache grows.

Reading an entry marks it as recently used.
:::

:::exercise title="Count the misses"
Look up each key with `fetch`. The loader should count how many times it had to run. Repeated keys must come from the cache.

```osl
import "std:cache"

auto lookups = cache.new()
int misses = 0

for key in ["a", "b", "a", "c", "a", "b"] (
  log key
)
log "misses" misses
```

```output
a
b
a
c
a
b
misses 3
```

> [!hint]
> `lookups.fetch(key, loader)` calls `loader()` only when the key isn't cached.

> [!hint]
> The loader is `def() int ( misses = misses + 1 \n return 1 )`, written over several lines.

```osl solution
import "std:cache"

auto lookups = cache.new()
int misses = 0

def load() int (
  misses = misses + 1
  return 1
)

for key in ["a", "b", "a", "c", "a", "b"] (
  lookups.fetch(key, load)
  log key
)
log "misses" misses
```

```output
a
b
a
c
a
b
misses 3
```
:::

## API reference

::api
