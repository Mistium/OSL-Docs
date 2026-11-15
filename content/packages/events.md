---
description: Announce named events inside one program and run every listener registered for them, in order.
package: events
---

# events

`std:events` lets one part of a program announce that something happened and another part react, without either knowing about the other. Events are named by strings. Any code can register a listener for a name, and any code can emit it. It works inside one program, across threads. It is not a network or message-queue tool.

## Listen and emit

`events.on(name, fn)` registers a listener. `events.emit(name, args...)` calls every listener of that name with the arguments, in the order they were added, and returns when they have all run:

```osl
import "std:events"

events.on("greet", def(string name) -> (
  log "hello " ++ name
))

events.emit("greet", "ada")
events.emit("greet", "bob")
```

```output
hello ada
hello bob
```

Listeners run on the thread that calls `emit`, so a slow listener slows the emitter. Emitting an event nobody listens to does nothing.

## More than one listener

Each registration is called, so several parts of a program can react to the same event. `events.count(name)` says how many listeners an event has:

```osl
import "std:events"

events.on("order", def(string item) -> (
  log "billing: " ++ item
))
events.on("order", def(string item) -> (
  log "shipping: " ++ item
))

log events.count("order")
events.emit("order", "book")
```

```output
2
billing: book
shipping: book
```

## Listening once

`events.once(name, fn)` registers a listener that removes itself just before its first call:

```osl
import "std:events"

events.once("ready", def() -> (
  log "ready fired"
))

log events.count("ready")
events.emit("ready")
events.emit("ready")
log events.count("ready")
```

```output
1
ready fired
0
```

## Removing a listener

`events.off(name, fn)` removes the earliest registration of `fn` for that event, whether it was added with `on` or `once`, and says whether there was one to remove. To remove a listener you need to keep the function in a variable or give it a name:

```osl
import "std:events"

def audit(string what) -> (
  log "audit: " ++ what
)

events.on("save", audit)
events.emit("save", "first")
log events.off("save", audit)
events.emit("save", "second")
log events.off("save", audit)
```

```output
audit: first
true
false
```

The same function added twice is two listeners and is called twice. Each `off` removes one of them. Listeners added or removed while an event is being emitted take effect from the next emit.

## When a listener throws

An error thrown by a listener propagates to the code that called `emit`, and the listeners after it are not called. Use `try` around `emit` if one bad listener shouldn't stop the caller:

```osl
import "std:events"

events.on("job", def() -> (
  throw error("JobError", "first listener failed")
))
events.on("job", def() -> (
  log "never reached"
))

auto outcome = try(events.emit("job"))
log outcome.isErr()
log outcome.unwrapErr().message
```

```output
true
first listener failed
```

## Events across threads

Listeners can be added, removed and emitted from any thread. A program can emit from several async functions and collect what listeners saw. Shared data is safe by default, and the order the threads reach `emit` is not fixed, so sort before printing:

```osl
import "std:events"

string[] seen = []

events.on("finished", def(string name) -> (
  seen.append(name)
))

async work(string name, int ms) string (
  thread.sleep(ms)
  events.emit("finished", name)
  return name
)

auto jobs = [work("compile", 30), work("lint", 10), work("test", 20)]
void thread.waitAll(jobs)

log seen.sort()
```

```output
["compile","lint","test"]
```

## A small event bus

Wrapping the event names in a class keeps the strings in one place and gives callers typed methods instead of bare names:

```osl
import "std:events"

class Cart (
  string[] items = []

  def add(string item) (
    self.items.append(item)
    events.emit("cart:changed", self.items.len)
  )
)

events.on("cart:changed", def(int count) -> (
  log "cart now has " ++ count ++ " items"
))

auto cart = Cart()
cart.add("book")
cart.add("pen")
```

```output
cart now has 1 items
cart now has 2 items
```

A listener's parameters aren't checked against what `emit` sends. A listener that expects an `int` but is emitted with nothing fails with a type error, and one that is given extra arguments ignores them, so keep each event's arguments the same everywhere.

## API reference

::api
