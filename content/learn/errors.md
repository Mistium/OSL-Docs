---
description: Handle things that can go wrong with result values, catch, and !, and know when to throw or exit.
lesson: 16
---

# Errors

Files go missing, networks drop and people type nonsense. OSL's answer is to make failure visible: an operation that can fail returns a `result`, which is either `ok` with a value or `err` with an error. You can't use the value without deciding what happens when there isn't one.

## Results

Converting text to a number can fail, so `.tryAs<int>` returns a result:

```osl
auto good = "42".tryAs<int>
auto bad = "forty-two".tryAs<int>
log good.isOk() bad.isErr()
log good.unwrap()
log bad.unwrapOr(0)
```

```output
true true
42
0
```

- `isOk()` and `isErr()` say which it is.
- `unwrap()` gives the value, and stops the program if there isn't one. Use it when failure really can't happen, or would be a bug.
- `unwrapOr(fallback)` gives the value, or the fallback for an error.

## Looking inside with switch

`switch` and `match` take `ok` and `err` cases and pull out what's inside:

```osl
def parseAge(string text) string (
  switch text.tryAs<int> (
    case ok(age)
      return "age " ++ age
    case err(e)
      return "not a number: " ++ text
  )
)

log parseAge("36")
log parseAge("old")
```

```output
age 36
not a number: old
```

## catch

`catch` after a call that returns a result handles the failure right there, and gives back the plain value when it succeeds. Its block decides what happens instead, usually with `return`, `continue` or `break`:

```osl
import "std:json"

string[] inputs = ["[1, 2, 3]", "not json", "[10]"]
for text in inputs (
  int[] values = json.parse<int[]>(text) catch (e) (
    log "skipping: " ++ e.kind
    continue
  )
  log values.sum()
)
```

```output
6
skipping: ParseError
10
```

When the handler is one statement, it can follow `catch` directly: `json.parse<int[]>(text) catch continue`. `(e)` names the error; leave it out when you don't need it.

A handler can also finish with a value, which becomes the result of the whole expression, so a failure turns into a fallback:

```osl
string[] inputs = ["12", "twelve"]
for text in inputs (
  int n = text.tryAs<int> catch (
    log "not a number: " ++ text
    -1
  )
  log n
)
```

```output
12
not a number: twelve
-1
```

Errors have a `kind`, such as `ParseError` or `TypeError`, and a `message` that explains what went wrong.

## Passing failure up with !

Often the function that hits an error isn't the right place to handle it. Put `!` after a result inside a function that returns a result, and a failure returns from the function straight away, handing the error to the caller. On success, `!` gives the plain value:

```osl
import "std:json"
import "std:result"

struct Config (
  string name = ""
  int port = 0
)

def loadPort(string text) result<int, error> (
  Config c = json.parse<Config>(text)!
  if c.port == 0 return result.err(error("no port set"))
  return result.ok(c.port)
)

log loadPort(`{"name": "web", "port": 8080}`).unwrap()
log loadPort(`{"name": "web"}`).unwrapErr().message
log loadPort("{").isErr()
```

```output
8080
no port set
true
```

`result.ok(value)` and `result.err(error)` build results, from `std:result`. `error("message")` makes an error value.

## Writing functions that can fail

Return `result<T, error>` from any function whose failure is part of normal life, and the compiler makes every caller deal with it:

```osl
import "std:result"

def divide(number a, number b) result<number, error> (
  if b == 0 return result.err(error("can't divide by zero"))
  return result.ok(a / b)
)

log divide(10, 4).unwrap()
log divide(1, 0).unwrapOr(-1)
```

```output
2.5
-1
```

## Ignored failures warn

Many package calls return results. If you use one as a plain value, OSL unwraps it for you but warns, so an unhandled failure is never silent. The fix is to say what you mean: handle it with `catch` or `switch`, pass it up with `!`, or `.unwrap()` it on purpose.

The compiler also reads your guards. After `if !fs.exists(path) return`, it knows reading `path` won't fail for that reason, and stops warning about it.

## throw, for the truly exceptional

`throw` stops the program with an error, unless something catches it. Keep it for bugs and situations the program can't sensibly continue from; for expected failures, return a result.

```osl fails
def checkedAge(int age) int (
  if age < 0 throw "age can't be negative"
  return age
)

log checkedAge(30)
log checkedAge(-1)
log "never reached"
```

```output
30
RuntimeError: age can't be negative
   |
 2 | if age < 0 throw "age can't be negative"
   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
in: main.osl:2
at: main.osl:7
```

An uncaught throw prints the error, the line that threw it, and the line that called it, then exits with a failure status.

`try(expression)` turns anything that throws into a result, so you can handle it with the same tools: `try(checkedAge(-1)).isErr()` is `true`.

## Ending the program

`exit` stops the program with an exit status. By convention, 0 means success and anything else means failure, which scripts and other programs can check:

```osl fails
string[] args = []
if args.len == 0 (
  error "usage: greet <name>"
  exit 2
)
```

```output
usage: greet <name>
```

`error` prints to the error stream, as `log` does to the normal one.

:::quiz
Inside `def load() result<Config, error>`, what does `json.parse<Config>(text)!` do when the JSON is invalid?

- [ ] Stops the whole program.
- [x] Returns the error from `load` straight away.
- [ ] Gives back an empty `Config`.

`!` passes the failure up to whoever called `load`.
:::

:::exercise title="Sum the valid numbers"
Add up the entries that are whole numbers and count how many weren't.

```osl
string[] entries = ["4", "seven", "10", "", "6"]

int total = 0
int bad = 0
log entries.len total bad
```

```output
20 2
```

> [!hint]
> Loop over `entries` and use `entry.tryAs<int>` on each.

> [!hint]
> `int n = entry.tryAs<int> catch ( ... )` with `bad++` and `continue` inside the catch block.

```osl solution
string[] entries = ["4", "seven", "10", "", "6"]

int total = 0
int bad = 0
for entry in entries (
  int n = entry.tryAs<int> catch (
    bad++
    continue
  )
  total += n
)
log total bad
```
:::
