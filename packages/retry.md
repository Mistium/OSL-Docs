# retry

Use `retry` to call a function again after it fails, waiting longer between attempts. Use it only
around operations that are safe to repeat.

```osl
import "std:retry"
```

## Example

```osl
import "std:retry"
import "std:result"

string value = retry.call(def(int attempt) -> (
  if attempt < 3 ( return result.err(error("NetworkError", "not ready")) )
  return result.ok("ready")
), {attempts: 5, delay: 100, factor: 2, maxDelay: 2000})

log value // ready
```

`retry.call` returns a `result`, so assigning it to a typed variable unwraps it and throws the last
error if every attempt failed. Handle the failure with `catch` instead:

```osl
import "std:retry"

string body = retry.call(def() -> ( throw error("TimeoutError", "slow") ), {attempts: 2}) catch (err) (
  log err // TimeoutError: retry.call: gave up after 2 attempts: slow
  return
)
log body
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `retry.call(fn: function, options?: object)` | `result<any, error>` | Calls `fn` until it succeeds or the attempts run out, and returns the first successful value. |
| `retry.delayFor(attempt: int, options?: object)` | `number` | The milliseconds `retry.call` waits after the given failed attempt (1 or more) with the same options. |

`fn` may take the attempt number, starting at 1, or no arguments. An attempt fails when `fn` throws
or returns a failed result. A successful result is unwrapped; any other return value is the success
value.

### Options

| Key | Default | Meaning |
| --- | --- | --- |
| `attempts` | `3` | How many times to call `fn` (1 or more). |
| `delay` | `0` | Milliseconds to wait after the first failure. |
| `factor` | `2` | Multiplies the delay after each failure (1 or more). |
| `maxDelay` | `30000` | Upper bound on any one delay, in milliseconds. |
| `jitter` | `0` | From 0 to 1. Randomises each delay by up to that fraction either way. |

There is no wait after the last attempt.

## Errors

- When every attempt fails, the error has the last failure's kind and a message naming the attempt
  count, such as `NetworkError: retry.call: gave up after 3 attempts: down`.
- `retry.call` throws `TypeError` when `fn` isn't a function.
- An option out of range, an unknown option, or `retry.delayFor` with an attempt below 1 throws
  `ValueError`. An option of the wrong type throws `TypeError`.

## Changes from earlier versions

`retry.run` and `retry.backoff` are gone; use `retry.call` and `retry.delayFor`. Delays are in
milliseconds, and the option is `maxDelay`: `max_delay` throws `ValueError`.
