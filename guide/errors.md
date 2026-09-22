# Errors and results

OSL has thrown errors for exceptional control flow and `result` values for operations where failure is part of the API.

## Throwing

```osl
if config == null (
  throw "Missing configuration"
)
```

A thrown value stops the current operation unless a catch expression handles it.

## Catch expressions

```osl
object data = schema.safeParse(input) catch (
  log _.unwrapErr().message
  return {}
)
```

Inside the catch block, `_` is the failed result supplied by the expression. A `return` exits the enclosing function. A `continue` or `break` applies to the enclosing loop. If the block reaches its end, OSL rethrows the original error.

A catch expression preserves the success type of `result<T, E>`. For example, `json.parse<string[int]>(text) catch (...)` produces `string[int]` on success. The source expression runs once.

## Result values

Import `std:result` when constructing result values directly:

```osl
import "std:result"

def divide(number left, number right) result<number, string> (
  if right == 0 return result.err("division by zero")
  return result.ok(left / right)
)
```

Inspect and unwrap the result:

```osl
result<number, string> calculated = divide(10, 2)

if calculated.isErr() (
  log calculated.unwrapErr()
  return
)

number value = calculated.unwrap()
```

`unwrap()` and `unwrapErr()` fail when called on the wrong variant. Use `unwrapAs(type)` when a dynamic success value needs an assertion.

## Assertions are runtime checks

`.assert(type)` is also a failure boundary:

```osl
object payload = decoded.assert(object)
```

Use `.assertElse(...)` when a fallback is valid. Do not use it to hide malformed required data. The
OriginChats server validates protocol input with schemas, then uses `.assert(...)` after validation
has established the type.

The compiler rejects a possibly absent typed-map value when code passes, assigns, or returns it as
a non-nullable reference. Handle the missing case explicitly:

```osl
string[object] users = {}
object user = users["ada"].assertElse(object, {name: "Unknown"})
```

## Runaway recursion

A function that keeps calling itself without reaching a base case eventually exhausts the stack.
`osl run` reports this as `RecursionError: Maximum call depth exceeded` and points at the recursive
call, rather than printing the Go runtime's stack dump.

## Process exits

The language command `exit status` terminates the process. The `std:process` package also provides `process.exit(status)`.

```osl
if invalidConfig (
  log "Invalid configuration"
  exit 1
)
```

`osl run` returns the program's exit status to the shell.
