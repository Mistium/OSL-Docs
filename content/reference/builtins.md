---
description: Every command, global value and global function built into OSL, and the names that look like built-ins but aren't.
---

# Built-in functions

Available in every program without an import.

```osl
log len("hello") max(3, 9, 4) min(2, 7)
log round(2.5) floor(7 / 2) abs(-3) pow(2, 8)
say "say is log"
```

```output
5 9 2
3 3 3 256
say is log
```

Everything else is a [package](../packages/index.md) or a method: [strings](strings.md), [arrays](arrays.md), [objects](objects.md), [numbers](numbers.md).

## Commands

Commands are statements, not functions. They take their values separated by spaces, with no brackets and no commas.

| Command | Does |
| --- | --- |
| `log a b c` | prints the values separated by spaces, then a new line, to standard output |
| `say a b c` | the same as `log` |
| `warn a b c` | prints to standard error |
| `error a b c` | prints to standard error |
| `wait seconds` | pauses the current thread (it takes seconds, and decimals are fine) |
| `exit code` | ends the program with that exit status; 0 means success |
| `return value` | leaves the current function (see [Syntax](syntax.md#return-break-and-continue)) |
| `throw value` | raises an error (see [Syntax](syntax.md#throw-and-try)) |
| `yield value` | gives the next value of a generator (see [Syntax](syntax.md#generators-and-yield)) |

```osl
log "a" 1 true [1, 2] {k: "v"} null
say "same as log"
wait 0.01
log "done"
```

```output
a 1 true [1,2] {"k":"v"} null
same as log
done
```

`log` prints text as it is, numbers without trailing zeros, and arrays and objects as JSON with the object keys sorted. `log` with no value is an error.

```osl error
log "a", "b"
```

## Global values

| Name | Is |
| --- | --- |
| `timestamp` | milliseconds since 1 January 1970 UTC, an `int64` |
| `performance` | microseconds since the same moment, an `int64`; subtract two readings to time something |
| `system_os` | the operating system: `linux`, `darwin` or `windows` |
| `origin` | an object about the compiler; `origin.version` is its version |

```osl
auto start = performance
wait 0.01
log performance - start >= 10000
log system_os.len > 0
log origin.version
log timestamp > 1700000000000
```

```output
true
true
9.3.0
true
```

## Types and size

| Function | Gives |
| --- | --- |
| `typeof(value)` | the name of the value's type as text: `int`, `number`, `string`, `boolean`, `array`, `object`, `null`, `function`, `byte`, `option`, `result`, `set`, `map`, or the name of a struct, class or enum |
| `len(value)` | the length of a string, array or object; the same as `value.len` |

`typeof` is for values that can be more than one type, such as `any` or a union. Inside an `if typeof(x) == "string"` the compiler narrows `x` to that type. When the type is already known the compiler warns, because the answer never changes.

```osl
def describe(any value) string (
  if typeof(value) == "int" return "int"
  if typeof(value) == "string" return "string of " ++ len(value)
  return typeof(value)
)
log describe(1) describe("hello") describe([1, 2]) describe(null)
log len("héllo") len([1, 2, 3]) len({a: 1})
```

```output
int string of 5 array null
5 3 1
```

## Numbers

Angles for `sin`, `cos` and `tan` are in degrees. `round`, `floor`, `ceil` and `abs` of an `int` give an `int`.

| Function | Gives |
| --- | --- |
| `round(x)` | the nearest whole number; halves round up |
| `floor(x)` | the largest whole number not above `x` |
| `ceil(x)` | the smallest whole number not below `x` |
| `abs(x)` | the size of `x` without its sign |
| `min(a, b, ...)` | the smallest value; with one array, its smallest item |
| `max(a, b, ...)` | the largest value; with one array, its largest item |
| `clamp(x, low, high)` | `x` kept between `low` and `high` (the bounds can come in either order) |
| `pow(base, exponent)` | `base ^ exponent`, as a `number` |
| `sin(x)`, `cos(x)`, `tan(x)` | trigonometry, in degrees |
| `degtorad(x)`, `radtodeg(x)` | converts between degrees and radians |
| `random(low, high)` | a random whole number from `low` to `high` inclusive when both are whole, otherwise a decimal from `low` up to `high` |
| `dist(x1, y1, x2, y2)` | the distance between two points |
| `gcd(a, b)`, `lcm(a, b)` | the greatest common divisor and the least common multiple of two whole numbers |

```osl
log round(2.5) round(-2.5) floor(-2.5) ceil(2.1) abs(-3)
log min(3, 1, 2) max(3, 1, 2) min([4, 2]) max([4, 9])
log clamp(15, 0, 10) clamp(-5, 0, 10)
log pow(2, 10) pow(2, 0.5)
log sin(90) cos(0) tan(45)
log degtorad(180) radtodeg(3.14159)
log dist(0, 0, 3, 4)
log gcd(12, 18) lcm(4, 6)
log random(1, 6) >= 1 and random(1, 6) <= 6
```

```output
3 -2 -3 3 3
1 3 2 9
10 0
1024 1.4142135623730951
1 1 1
3.141592653589793 179.9998479605043
5
6 12
true
```

`sqrt` is a method, as in `16.sqrt()`, not a global function. See [Numbers](numbers.md).

## Converting values

These functions convert one value, like the methods of the same job (`.toInt()`, `.toStr()`). Prefer the methods in application code. Text that isn't a number converts to `0`. To find out whether a conversion worked use `.tryAs<T>`.

| Function | Gives |
| --- | --- |
| `int(x)` | `x.toInt()` |
| `number(x)` | `x.toNum()` |
| `string(x)` | `x.toStr()` |
| `boolean(x)` | the truthiness of `x`: `false` for `false`, `0`, `""`, `null` and empty arrays and objects, `true` for anything else |
| `array(x)` | `x.toArray()`: an array holding `x`, or `x` itself if it already is one |
| `object(x)` | `x.toObject()` |

```osl
log int("42") + 1
log number("2.5") * 2
log string(5) ++ "!"
log boolean("no") boolean("") boolean(0) "no".toBool()
log array(1) array([1, 2])
log ["1", "2", "x"].map(s -> int(s))
```

```output
43
5
5!
true false false false
[1] [1,2]
[1,2,0]
```

## Text encoding

| Function | Gives |
| --- | --- |
| `btoa(text)` | the text as Base64 |
| `atob(text)` | the Base64 text decoded; `""` if it isn't valid |
| `encodeURIComponent(text)` | the text escaped for use in a URL |
| `decodeURIComponent(text)` | the escapes in a URL part decoded |

```osl
log btoa("hello") atob("aGVsbG8=")
log encodeURIComponent("a b&c=d")
log decodeURIComponent("a%20b%26c")
```

```output
aGVsbG8= hello
a%20b%26c%3Dd
a b&c
```

## Errors, results and options

| Function | Gives |
| --- | --- |
| `error(message)` | an `error` value with that message |
| `error(kind, message)` | an `error` with a kind such as `"ParseError"` |
| `try(expression)` | a `result` holding the value of the expression, or the error it threw |
| `try(( statements ))` | a `result` for a block of statements: `ok` if it ran, `err` if it threw |
| `ask(prompt)` | prints the prompt, reads a line from standard input and gives a `result` holding the line (`ask()` reads without a prompt) |
| `some(value)` | an `option` that holds a value |
| `none()` | an empty `option` |
| `unit()` | the `unit` value, which means "nothing to report" |

`error` is also a command, which prints to standard error. `ask` prints the prompt without a new line, and gives an `err` result when the input ends.

```osl stdin="Ada\n"
def divide(int a, int b) int (
  if b == 0 throw error("MathError", "can't divide by zero")
  return a / b
)
auto good = try(divide(10, 2))
auto bad = try(divide(1, 0))
log good.unwrap() bad.isErr()
log bad.unwrapErr().kind bad.unwrapErr().message
auto found = some(3)
log found.isSome() none().isNone() found.unwrap()
string name = ask("Name? ").unwrapOr("nobody")
log "Hello, " ++ name
```

```output
5 true
MathError can't divide by zero
true true 3
Name? Hello, Ada
```

See [Syntax](syntax.md#throw-and-try) for `throw` and `catch`, and the [Errors lesson](../learn/errors.md) for how results fit together.

## Making collections and values

| Function | Gives |
| --- | --- |
| `make(int[], n)` | an array of `n` zero values of that type |
| `make(int[3])` | a fixed-size array |
| `map()` | an empty `map` |
| `set()`, `set(array)` | an empty set, or a set of the items of an array |
| `xml(text)`, `xml()` | a parsed XML document, or an empty one |
| `canvas(width, height, color)` | a drawing surface |
| `symbol()` | a new unique symbol |

```osl
log make(int[], 3) make(string[], 2)
auto seen = set([1, 2, 2, 3])
log seen.len
auto ids = map()
ids.set("a", 1)
log ids.get("a")
```

```output
[0,0,0] ["",""]
3
1
```

## Names that are not built-ins

Some names from other languages, and from older OSL documentation, don't exist. The compiler says so, and for many of them suggests the OSL way.

| Not defined | Use |
| --- | --- |
| `print`, `println`, `printf`, `puts` | `log value` |
| `sqrt(x)` | `x.sqrt()` (returns `null` for a negative number) |
| `range(a, b)` | `a to b` |
| `keys(o)`, `values(o)`, `entries(o)` | `o.getKeys()`, `o.getValues()`, `o.getEntries()` |
| `input(prompt)` | `ask(prompt)` |
| `sleep(seconds)` | `wait seconds`, or `thread.sleep(ms)` from [std:thread](../packages/thread.md) |
| `parseInt(x)`, `parseFloat(x)` | `x.toInt()`, `x.toNum()` |
| `isNaN(x)`, `isFinite(x)` | `x.isNaN()`, `x.isFinite()` |
| `not x` | `!x` |

`osl fix` rewrites `sqrt`, `keys`, `values`, `entries` and `input` for you. `range` it leaves to you.

```osl error
log sqrt(16)
```
