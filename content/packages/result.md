---
description: Build results, chain them with andThen, orElse and mapErr, and turn failures into fallbacks, without a pile of nested checks.
package: result
---

# result

A `result<T, E>` is the outcome of something that can fail: either `ok` with a value of type `T`, or `err` with an error `E`. The [errors lesson](../learn/errors.md) shows how to receive one with `catch`, `switch` and `!`. This page is the other half: making your own results, and the methods that let you transform and combine them without unwrapping them first.

The type is built into the language, but `std:result` provides the constructors `result.ok`, `result.err` and `result.fromGo`, so import it where you make results.

## Making results

`result.ok(value)` is a success and `result.err(error)` is a failure. `error("message")` makes an error value, and `error("Kind", "message")` gives it a kind you can test:

```osl
import "std:result"

def divide(number a, number b) result<number, error> (
  if b == 0 return result.err(error("MathError", "can't divide by zero"))
  return result.ok(a / b)
)

log divide(10, 4).unwrap()

auto failed = divide(1, 0)
log failed.isErr()
log failed.unwrapErr().kind
log failed.unwrapErr().message
```

```output
2.5
true
MathError
can't divide by zero
```

Return `result<T, error>` from any function whose failure is part of normal operation. Callers must then decide what a failure means.

> [!warning]
> A result used where a plain value is expected is unwrapped for you, and throws if it was an error. The compiler warns about this, so write the handling out with the tools below.

## Reading a result

| Method | On `ok` | On `err` |
| --- | --- | --- |
| `isOk()` `isErr()` | `true` `false` | `false` `true` |
| `unwrap()` | the value | throws the error |
| `unwrap("message")` | the value | throws with your message |
| `unwrapOr(fallback)` | the value | the fallback |
| `unwrapOrElse(fn)` | the value | what `fn(error)` returns |
| `unwrapErr()` | throws a `StateError` | the error |

`unwrapOrElse` is `unwrapOr` for when the fallback depends on the error, or is costly to compute, since the function only runs on failure:

```osl
import "std:result"

def port(string text) result<int, error> (
  int n = text.tryAs<int> catch (e) (
    return result.err(error("ParseError", "not a number: " ++ text))
  )
  return result.ok(n)
)

log port("8080").unwrapOr(80)
log port("http").unwrapOr(80)
log port("http").unwrapOrElse(e -> e.message.len)
log try(port("http").unwrap("config needs a port")).unwrapErr().message
```

```output
8080
80
18
config needs a port
```

`expect(message)` is the same as `unwrap(message)`: use either to say what you were counting on when the program stops.

## Chaining with andThen

Suppose each step can fail, and each needs the last step's value. Unwrapping every result and checking it gets deep fast. `andThen(fn)` runs `fn` on the value if the result is `ok`, and `fn` returns the next result. A failure anywhere skips every step after it:

```osl
import "std:result"

def parseNumber(string text) result<int, error> (
  int n = text.tryAs<int> catch (e) (
    return result.err(error("ParseError", "not a number: " ++ text))
  )
  return result.ok(n)
)

def checkPositive(int n) result<int, error> (
  if n <= 0 return result.err(error("RangeError", "must be positive"))
  return result.ok(n)
)

def parsePositive(string text) result<int, error> (
  return parseNumber(text).andThen(checkPositive).andThen(n -> result.ok(n * 10))
)

log parsePositive("4").unwrap()
log parsePositive("-4").unwrapErr().message
log parsePositive("four").unwrapErr().message
```

```output
40
must be positive
not a number: four
```

The `!` operator from the [errors lesson](../learn/errors.md) does the same job as statements, and reads better when you need the intermediate values. Use `andThen` for a short pipeline of functions.

## Recovering with orElse

`orElse(fn)` is the opposite: it runs only on failure, and `fn(error)` returns a new result, so you can try a backup:

```osl
import "std:result"

def fromEnv(string name) result<string, error> (
  return result.err(error("NotFound", name ++ " is not set"))
)

def fromDefault(error e) result<string, error> (
  return result.ok("localhost")
)

string host = fromEnv("HOST").orElse(fromDefault).unwrap()
log host
```

```output
localhost
```

Chain several `orElse` calls to try a list of sources in order.

## Changing the error with mapErr

`mapErr(fn)` transforms the error and leaves a success alone. Use it to add context as an error travels up, so "not a number: four" becomes "reading port: not a number: four":

```osl
import "std:result"

def parse(string text) result<int, error> (
  int n = text.tryAs<int> catch (e) (
    return result.err(error("ParseError", "not a number: " ++ text))
  )
  return result.ok(n)
)

auto r = parse("four").mapErr(e -> error("ConfigError", "reading port: " ++ e.message))
log r.unwrapErr().kind
log r.unwrapErr().message
```

```output
ConfigError
reading port: not a number: four
```

## Errors have a kind

An error value has a `kind` (a short category) and a `message`. Callers can branch on the kind and leave the message for people:

```osl
import "std:result"

def load(string name) result<string, error> (
  if name == "" return result.err(error("ValueError", "name is empty"))
  if name == "ghost" return result.err(error("NotFoundError", "no such file"))
  return result.ok("contents of " ++ name)
)

for name in ["notes", "", "ghost"] (
  switch load(name) (
    case ok(text)
      log text
    case err(e)
      log e.kind
  )
)
```

```output
contents of notes
ValueError
NotFoundError
```

## Results without a value

Some operations succeed with nothing to report, such as saving a file. Leave the type empty, and make the success with `result.ok()`:

```osl
import "std:result"

def save(string name) result<, error> (
  if name == "" return result.err(error("ValueError", "a name is required"))
  return result.ok()
)

log save("report").isOk()
log save("").isErr()
```

```output
true
true
```

## Working with a list of results

Results are ordinary values, so they live in arrays. Typed results in an array let you count the failures and gather the successes:

```osl
import "std:result"

def half(int n) result<int, error> (
  if n % 2 != 0 return result.err(error("ValueError", n ++ " is odd"))
  return result.ok(n / 2)
)

result<int, error>[] outcomes = [half(4), half(7), half(10), half(3)]

log outcomes.filter(r -> r.isOk()).map(r -> r.unwrap())
log outcomes.filter(r -> r.isErr()).len
log outcomes.map(r -> r.unwrapOr(0)).sum()
```

```output
[2,5]
2
7
```

## Turning a throw into a result

`try(expression)` runs code that might throw and gives back a result. It is how you fit a function that throws into a pipeline:

```osl
import "std:result"

def risky(int n) int (
  if n < 0 throw error("RangeError", "negative")
  return n * 2
)

auto good = try(risky(4))
auto bad = try(risky(-1))
log good.unwrap()
log bad.unwrapErr().kind
```

```output
8
RangeError
```

## Results from Go

When you call Go code, a function returns a value and an error as two things. `result.fromGo(value, error)` joins them: `ok(value)` when the error is null, otherwise `err`. A text error written `Kind: message` keeps its kind:

```osl
import "std:result"

auto good = result.fromGo(42, null)
log good.unwrap()

auto bad = result.fromGo(0, "NotFoundError: gone")
log bad.unwrapErr().kind
log bad.unwrapErr().message
```

```output
42
NotFoundError
gone
```

:::quiz
What does this print?

```osl fragment
auto r = result.ok(4).andThen(n -> result.err(error("ValueError", "too big")))
log r.isOk()
```

- [ ] `true`, because the first result was `ok`
- [x] `false`, because the function passed to `andThen` returned an error

`andThen` runs on an `ok` value and returns whatever result the function gives, so a failure there becomes the outcome.
:::

:::exercise title="A safe sum"
Write `total(string[] texts)`, which returns a result holding the sum of the whole numbers in `texts`, or the first failure. Use `andThen`. The program prints -1 for the list with a bad entry.

```osl
import "std:result"

def parse(string text) result<int, error> (
  int n = text.tryAs<int> catch (e) (
    return result.err(error("ParseError", "not a number: " ++ text))
  )
  return result.ok(n)
)

def total(string[] texts) result<int, error> (
  return result.ok(0)
)

log total(["1", "2", "3"]).unwrapOr(-1)
log total(["1", "x", "3"]).unwrapOr(-1)
```

```output
6
-1
```

> [!hint]
> Keep a running total as a result, and for each text do `sum = sum.andThen(acc -> parse(text).andThen(n -> result.ok(acc + n)))`.

> [!hint]
> Start with `auto sum = result.ok(0)` and loop over `texts`.

```osl solution
import "std:result"

def parse(string text) result<int, error> (
  int n = text.tryAs<int> catch (e) (
    return result.err(error("ParseError", "not a number: " ++ text))
  )
  return result.ok(n)
)

def total(string[] texts) result<int, error> (
  result<int, error> sum = result.ok(0)
  for text in texts (
    sum = sum.andThen(acc -> parse(text).andThen(n -> result.ok(acc + n)))
  )
  return sum
)

log total(["1", "2", "3"]).unwrapOr(-1)
log total(["1", "x", "3"]).unwrapOr(-1)
```
:::

## API reference

::api
