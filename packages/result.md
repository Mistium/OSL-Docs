# result

> Success/error result values

A `Result` represents either success (a value) or failure (an error), so functions can report problems
without throwing. Create one with `result.ok(value)` or `result.err(error)`, then check it before
reading.

```javascript
import "osl/result"
```

## Creating results

```javascript
auto good = result.ok(42)
auto bad  = result.err("something went wrong")
```

## Methods

Call these on a result value:

- `r.isOk()` → `boolean` — did it succeed?
- `r.isErr()` → `boolean` — did it fail?
- `r.unwrap()` → the success value (errors if it's an error result)
- `r.unwrapOr(default)` → the success value, or `default` on error
- `r.expect(message)` → the success value, or fails with `message`
- `r.unwrapErr()` → the error value (errors if it's a success result)
- `r.expectErr(message)` → the error value, or fails with `message`

## Example

```javascript
import "osl/result"

def divide(number a, number b) (
  if b == 0 (
    return result.err("cannot divide by zero")
  )
  return result.ok(a / b)
)

auto r = divide(10, 2)

if r.isOk() (
  log "result: " ++ r.unwrap()
) else (
  log "error: " ++ r.unwrapErr()
)

// Or with a fallback:
log divide(1, 0).unwrapOr(0)   // 0
```

Some standard-library packages return a `Result` directly — for example
[`json`](json.md)`.parse(...)`. See also [`option`](option.md) for values that may simply be absent.
