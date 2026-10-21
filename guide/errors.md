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
object data = try(shape.parse(input)) catch (
  log _.message
  return {}
)
```

Inside the catch block, `_` is the failed result supplied by the expression. A `return` exits the enclosing function. A `continue` or `break` applies to the enclosing loop. If the block reaches its end, OSL rethrows the original error.

A catch expression preserves the success type of `result<T, E>`. For example, `json.parse<string[int]>(text) catch (...)` produces `string[int]` on success. The source expression runs once.

## Result values

Import `std:result` when constructing result values directly:

```osl
import "std:result"

def divide(number left, number right) result<number, error> (
  if right == 0 return result.err(error("division by zero"))
  return result.ok(left / right)
)
```

Inspect and unwrap the result:

```osl
result<number, error> calculated = divide(10, 2)

if calculated.isErr() (
  log calculated.unwrapErr()
  return
)

number value = calculated.unwrap()
```

`unwrap()` and `unwrapErr()` fail when called on the wrong variant. Use `unwrapAs(type)` when a dynamic success value needs an assertion.

## Propagating results

Append `!` to a result to propagate its failure to the enclosing function. The enclosing function must return a compatible `result<U, E>`:

```osl
import "std:fs"
import "std:json"

def readConfig<T>(string path) result<T, error> (
  string text = fs.readFile(path)!
  return json.parse<T>(text)!
)
```

On success, `!` keeps the result, so the normal typed declaration unwraps `fs.readFile(path)!` to a string. A failure returns from the enclosing function immediately. It does not throw, and `try(...)` does not catch it. The error types must match; `result<T, string>` cannot propagate into `result<T, error>`.

`!` is only valid inside a function that returns a result. Its operand must be a result-typed expression, such as a call or a variable.

## Guards make failure impossible

The compiler follows the conditions around a call. When a guard establishes the condition that makes a package method safe, an implicit result unwrap does not warn:

```osl
import "std:fs"

def shardFiles(string root) string[] (
  if !fs.isDir(root) return []
  return fs.readDir(root)
)
```

After the early return, `fs.isDir(root)` is known to be true, so `fs.readDir(root)` cannot fail there. The same works inside an `if` branch, after an `and` condition, and through a chain of early returns. Assigning to a variable clears the guards that mention it. Package methods declare these conditions in their doc comments with `osl:safeWhen` and `osl:implies`; see the package API standard in `docs/packages.md`.

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

## Process exits

The language command `exit status` terminates the process. The `std:process` package also provides `process.exit(status)`.

```osl
if invalidConfig (
  log "Invalid configuration"
  exit 1
)
```

`osl run` returns the program's exit status to the shell.

## Null values at runtime

`RuntimeError: Tried to use a null value` means the program dereferenced null. The marked line is where the value was used, not necessarily where it became null. Check for a variable read before assignment, or a global from a file that loads after the one using it. Directory imports load files alphabetically and run each file's top-level statements in load order, so a file that calls into a global defined in a later-loading file crashes at startup. Importing the defining file first fixes it.
