# Errors and results

OSL reports failure in three ways, depending on whose mistake it was:

| Situation | Signal | Example |
| --- | --- | --- |
| The outside world or the input data was bad | a `result<T, error>` | `fs.readFile(path)`, `json.parse(text)` |
| The thing asked for doesn't exist, and that's a normal answer | a nullable `T?` (`null`) | `cache.get(key)`, `regex.findFirst(text)` |
| The calling code is wrong | a thrown error (`TypeError`, `ValueError`, `StateError`, ...) | `random.sample(items, -1)` |

Every standard package follows these rules, so you never have to check for `""`, `-1`, `false`, or
a `{success, error}` object to find out whether a call worked.

## Errors

An `error` value has two fields, `kind` and `message`, and prints as `Kind: message`:

```osl
error problem = error("NotFoundError", "notes.txt is missing")
log problem.kind     // NotFoundError
log problem.message  // notes.txt is missing
log problem          // NotFoundError: notes.txt is missing

log error("disk is full") // RuntimeError: disk is full
```

`error(message)` makes a `RuntimeError`; `error(kind, message)` sets the kind. Reading any other
field of an error is a compile error.

### Error kinds

Branch on `kind` to handle one kind of failure differently. Packages pick the most specific one:

| Kind | Meaning |
| --- | --- |
| `NotFoundError` | A file, key, host, or remote resource doesn't exist |
| `PermissionError` | Access denied by the OS or the remote side, or a wrong password |
| `IOError` | Any other file, stream, or device failure |
| `NetworkError` | Connection refused or reset, DNS failure, TLS failure |
| `TimeoutError` | A deadline passed |
| `ParseError` | The input is malformed (JSON, CSV, image bytes, a URL, ...) |
| `UnsupportedError` | The input is valid, but this format or feature isn't supported |
| `StateError` | The operation isn't valid right now (a closed handle, a server not started) |
| `ValueError` | An argument has the right type but an invalid value |
| `TypeError` | An argument has the wrong type |
| `RuntimeError` | Anything that fits none of the above |

A few packages add their own kinds, such as `DeadlockError` and `LockError` in
[`sync`](../packages/sync.md) and `AssertionError` in [`testing`](../packages/testing.md).

Errors from Go code are classified automatically: a missing file is a `NotFoundError`, a deadline a
`TimeoutError`, a JSON syntax error a `ParseError`, and so on. Their message starts with the call
that failed, such as `fs.readFile: open notes.txt: no such file or directory`.

## Throwing

```osl
def configure(object? config) (
  if config == null (
    throw error("ValueError", "missing configuration")
  )
)
```

A thrown error stops the current operation unless something handles it. An uncaught error ends
the program and prints as `Kind: message` with the line it came from. Throwing a string such as
`throw "missing configuration"` throws a `RuntimeError`; a string of the form
`"ValueError: missing configuration"` keeps its kind.

## Result values

A function that can fail returns `result<T, error>`. Build one with `result.ok` and `result.err`:

```osl
def divide(number left, number right) result<number, error> (
  if right == 0 return result.err(error("ValueError", "division by zero"))
  return result.ok(left / right)
)
```

`result.ok()` with no value is a `unit` success; a function that only succeeds or fails returns
`result<unit, error>`, which can be written `result<, error>`. See [`result`](../packages/result.md)
for every method.

## Using a result

Callers choose how much they care, and every level is one line.

**Don't care.** A result used where a plain value is expected unwraps itself, and throws its error
if it failed:

```osl
import "std:fs"

fs.writeFile("notes.txt", "hello")
string text = fs.readFile("notes.txt")   // unwraps; throws NotFoundError if missing
log text.len
```

**Fallback.** `unwrapOr` gives a default instead:

```osl
import "std:fs"

string text = fs.readFile("missing.txt").unwrapOr("")
log text.len // 0
```

**Handle.** `catch` runs a block when the result failed:

```osl
import "std:fs"

def load() string (
  string text = fs.readFile("missing.txt") catch (err) (
    log "couldn't read notes: " ++ err.message
    return ""
  )
  return text
)
log load()
```

**Inspect.** Destructuring gives the value and the error separately. Exactly one of them is `null`:

```osl
import "std:fs"

auto text, err = fs.readFile("missing.txt")
if err != null and err.kind == "NotFoundError" ( log "no notes yet" )
```

### Where a result unwraps

A statically typed result unwraps itself, throwing its error on failure, wherever the compiler
expects a plain value:

- typed declarations and assignments to typed variables (`string text = f()`);
- typed parameters and returns;
- operands and string templates (`f() + 1`, `` `${f()} items` ``);
- property reads, indexing, and calling a method other than a result method (`f().len`);
- `for ... in`;
- the items of array and object literals, so `{body: fs.readFile(p)}` holds the text;
- arguments to package functions, builtin functions, and handle methods, even into an `any`
  parameter;
- a discarded call, so an ignored failure throws instead of disappearing.

These keep the result instead:

- `auto x = f()`, `any x = f()`, and other inferred declarations;
- `catch`, `try(...)`, and destructuring;
- a `result` parameter, return type, or typed collection such as `result<int, error>[]`;
- an `any` or generic parameter of a function you wrote;
- calling a result method: `isOk`, `isErr`, `unwrap`, `unwrapOr`, `expect`, `unwrapErr`,
  `expectErr`, `unwrapAs`.

Use `void f()` to discard a result deliberately, failure included.

### Success in a boolean position

In a condition, and anywhere a `boolean` (or `bool`) is expected, a `result<unit, error>` means
"did it succeed". An action that only succeeds or fails can be tested directly:

```osl
import "std:fs"

if fs.remove("old.txt") (
  log "removed"
) else (
  log "nothing to remove"
)
boolean saved = fs.writeFile("new.txt", "hi")
log saved // true
```

Any other result unwraps there, so a `result<boolean, error>` is its boolean, and a failure throws.

### Printing results

`log` prints a result without throwing: an ok result as its value and a failed one as its error,
also inside arrays and objects. A `result<unit, error>` that succeeded prints `unit`. `typeof`
reports `"result"`.

## Catch

`catch` handles a failed result or a thrown error. `catch (err)` binds the error; without a name it
is `_`:

```osl
import "std:fs"

fs.writeFile("/no/such/dir/x.txt", "hi") catch (err) ( log "write failed: " ++ err.kind )

for name in ["a.txt", "b.txt"] (
  string body = fs.readFile(name) catch (
    log "skipping " ++ name ++ ": " ++ _.kind
    continue
  )
  log body
)
```

Inside the block, `return` exits the enclosing function, and `continue` or `break` applies to the
enclosing loop. The expression on the left runs once.

The bound name is the `error`, not the result, so read `err.kind` and `err.message` directly.
Calling `isOk`, `isErr`, or `unwrapErr` on it is a compile error.

- **As a statement**, `f() catch (err) ( ... )` handles the error and execution continues after it.
  It also catches an error thrown by a call that returns nothing.
- **Where the value is used**, as in `string text = f() catch (err) ( ... )` or a call argument,
  there is no value to continue with, so the block should leave with `return`, `throw`,
  `continue`, or `break`. A block that reaches its end rethrows the error from the catch's line.
- **Inside a call argument**, `catch` handles only that argument's failure. A `return` in the block
  returns from the enclosing function, so here `greeting` returns `"hello"` without calling
  `shout`:

```osl
import "std:fs"

def shout(string s) string ( return s.toUpper() )

def greeting() string (
  return shout(fs.readFile("greeting.txt") catch (err) ( return "hello" ))
)
log greeting() // hello when greeting.txt is missing
```

`catch` covers results unwrapped anywhere inside its left expression, so `words(s).len catch ...`
also handles a failing `words(s)`. A `catch` on a value that isn't a result keeps the value.

## try

`try(expr)` runs an expression and returns `result<T, error>` instead of throwing. Use it to turn a
thrown error into a value:

```osl
import "std:random"

auto r = try(random.sample([1, 2, 3], -1))
log r.isErr()          // true
log r.unwrapErr().kind // ValueError
log r                  // ValueError: random.sample: ...
```

The error keeps the kind it was thrown with and its plain message. `try` of an expression that is
already a result returns that result rather than nesting it.

## Assertions are runtime checks

`.assert(type)` is also a failure boundary:

```osl
any[] messages = [{name: "Ada"}, "plain text"]
object payload = messages[1].assert(object)
log payload.name
```

Use `.assertElse(...)` when a fallback is valid. Do not use it to hide malformed required data.

The compiler rejects a possibly absent typed-map value when code passes, assigns, or returns it as
a non-nullable reference. Handle the missing case explicitly:

```osl
string[object] users = {}
object user = users["ada"].assertElse(object, {name: "Unknown"})
log user.name
```

## Process exits

The language command `exit status` terminates the process. The `std:process` package also provides
`process.exit(status)`.

```osl
boolean invalidConfig = false
if invalidConfig (
  log "Invalid configuration"
  exit 1
)
```

`osl run` returns the program's exit status to the shell.

## Null values at runtime

`RuntimeError: Tried to use a null value` means the program dereferenced null. The marked line is
where the value was used, not necessarily where it became null. Check for a variable read before
assignment, or a global from a file that loads after the one using it. Directory imports load files
alphabetically and run each file's top-level statements in load order, so a file that calls into a
global defined in a later-loading file crashes at startup. Importing the defining file first fixes
it.
