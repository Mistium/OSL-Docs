---
description: Call a function again when it fails, with a growing wait between attempts, and get the outcome back as a result.
package: retry
---

# retry

Networks drop, files are briefly locked and services restart. `std:retry` calls a function again when it fails, waiting a little longer each time, so a short fault doesn't become your program's failure. The outcome comes back as a [result](../learn/errors.md): the first success, or an error once the attempts run out.

## The simplest retry

`retry.call(fn)` calls `fn` up to three times. `fn` receives the attempt number, starting at 1. An attempt fails when `fn` throws or returns a failed result:

```osl
import "std:retry"

auto outcome = retry.call(def(int attempt) string (
  log "attempt " ++ attempt
  if attempt < 3 (
    throw error("NetError", "server busy")
  )
  return "got the data"
))

log outcome.unwrap()
```

```output
attempt 1
attempt 2
attempt 3
got the data
```

The value comes back as a result because every attempt can fail. Handle it as you would any other, with `unwrap`, `unwrapOr`, `switch` or `catch`.

## When every attempt fails

If the attempts run out, you get an error. It has the kind of the last failure, and a message that says how many attempts were made and what the last one said:

```osl
import "std:retry"

auto outcome = retry.call(def(int attempt) int (
  throw error("NetError", "down on attempt " ++ attempt)
))

switch outcome (
  case ok(value)
    log "worked: " ++ value
  case err(e)
    log e.kind
    log e.message
)
```

```output
NetError
retry.call: gave up after 3 attempts: down on attempt 3
```

Keeping the kind means code that handles `NetError` elsewhere keeps working when the call goes through `retry`.

## Failing without throwing

A function that returns a `result` instead of throwing counts too. A failed result is a failed attempt, and a successful one is unwrapped for you:

```osl
import "std:retry"

def flaky(int attempt) result<int, error> (
  if attempt < 2 (
    return result.err(error("StateError", "not ready"))
  )
  return result.ok(attempt * 10)
)

log retry.call(flaky).unwrap()
```

```output
20
```

## Options

The second argument is an object of options:

- `attempts`: how many calls to make in all (default 3).
- `delay`: milliseconds to wait after the first failure (default 0).
- `factor`: what the wait is multiplied by after each failure (default 2).
- `maxDelay`: the longest wait, in milliseconds (default 30000).
- `jitter`: from 0 to 1, how much to randomise each wait, up to that fraction either way (default 0).

```osl
import "std:retry"

int calls = 0

auto outcome = retry.call(def() string (
  calls++
  if calls < 5 (
    throw error("TimeoutError", "no answer")
  )
  return "answered"
), {attempts: 6, delay: 5})

log outcome.unwrap()
log calls
```

```output
answered
5
```

Waits of 5, 10, 20 and 40 milliseconds happened between the five calls. An option out of range, such as `attempts: 0`, throws a `ValueError`.

## Working out the waits

`retry.delayFor(attempt, options)` says how many milliseconds `call` waits after a given failed attempt, with the same options. It's useful to check a policy before you use it:

```osl
import "std:retry"

for attempt in 1 to 6 (
  log attempt retry.delayFor(attempt, {delay: 100, maxDelay: 1000})
)
```

```output
1 100
2 200
3 400
4 800
5 1000
6 1000
```

Each wait doubles until it reaches `maxDelay`. Set `factor: 1` for a fixed wait.

## Jitter

When many clients fail at the same moment and all retry on the same schedule, they hit the service together again. `jitter` spreads the waits out. With `jitter: 0.5` each wait lands within half of its normal length either side, so a 100 ms wait is between 50 and 150:

```osl
import "std:retry"

boolean inRange = true
loop 20 (
  number ms = retry.delayFor(1, {delay: 100, jitter: 0.5})
  if ms < 50 or ms > 150 (
    inRange = false
  )
)
log inRange
```

```output
true
```

## Retrying on a thread

`retry.call` blocks the calling thread while it waits between attempts. To keep the rest of your program moving, put it inside an [async function](thread.md) and wait for the thread when you need the answer:

```osl
import "std:retry"

async fetchWithRetry(string name) result<string, error> (
  return retry.call(def(int attempt) string (
    if attempt < 2 (
      throw error("NetError", name ++ " was busy")
    )
    return name ++ " loaded"
  ), {attempts: 3, delay: 10})
)

auto a = fetchWithRetry("users")
auto b = fetchWithRetry("orders")
log "both started"
log a.wait().unwrap()
log b.wait().unwrap()
```

```output
both started
users loaded
orders loaded
```

To limit the total time, wait with a timeout, as in `a.wait({timeout: 2000})`. The thread keeps retrying after a timeout, so it bounds how long you wait, not how long it works.

## Only retry what can pass

`retry.call` retries every failure. A wrong password will be wrong on the third attempt too, so a permanent problem should not look like a failure to `retry`. Return it as an ordinary value, and keep throwing only for the faults that can clear up:

```osl
import "std:retry"

def login(string password, int attempt) string (
  if attempt == 1 (
    throw error("NetError", "connection reset")
  )
  if password != "secret" (
    return "denied"
  )
  return "welcome"
)

for password in ["secret", "guess"] (
  auto outcome = retry.call(def(int attempt) string -> login(password, attempt), {delay: 1})
  log password outcome.unwrap()
)
```

```output
secret welcome
guess denied
```

Both calls failed once with the network error and were retried. The wrong password came back as `"denied"` on the second attempt, which is a success as far as `retry` is concerned, so it stopped there.

## API reference

::api
