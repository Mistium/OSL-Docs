---
description: Name a piece of code, give it parameters and a return type, and call it from anywhere.
lesson: 9
---

# Functions

A function is a named piece of code you can run whenever you need it. Define one with `def`, its parameters in brackets with their types first, then the type it returns:

```osl
def greet(string name) string (
  return "Hello, " ++ name ++ "!"
)

log greet("Ada")
log greet("Linus")
```

```output
Hello, Ada!
Hello, Linus!
```

`return` hands a value back to whoever called the function and ends it there.

## One-line functions

When a function is a single expression, write `->` and the expression instead of a block:

```osl
def square(number n) number -> n * n
def isEven(int n) boolean -> n % 2 == 0

log square(1.5)
log isEven(10)
```

```output
2.25
true
```

## Functions that return nothing

Leave out the return type when a function just does something:

```osl
def banner(string text) (
  string line = "=" * (text.len + 4)
  log line
  log "| " ++ text ++ " |"
  log line
)

banner("OSL")
```

```output
=======
| OSL |
=======
```

A bare `return` leaves such a function early.

## Order doesn't matter

A function can be called above the line that defines it. The compiler reads the whole file first, so put your functions wherever they read best, often at the bottom, below the code that uses them:

```osl
log total([4, 8, 15])

def total(int[] values) int -> values.sum()
```

```output
27
```

## Types keep calls honest

The compiler checks every call against the function's parameters, and every `return` against its return type:

```osl error
def area(number width, number height) number -> width * height

log area(3, "four")
```

```osl error
def label(int count) int (
  return count ++ " items"
)
```

The function promises an `int` and returns text, so the compiler stops it before it can run.

## Defaults and optional parameters

A parameter can have a default, used when the caller leaves it out:

```osl
def greet(string name = "world") string -> "Hello, " ++ name

log greet()
log greet("Ada")
```

```output
Hello, world
Hello, Ada
```

A last parameter whose type ends in `?` can be left out too, and is `null` when it is:

```osl
def address(string name, string? title) string (
  if title == null return name
  return title ++ " " ++ name
)

log address("Ada")
log address("Lovelace", "Countess")
```

```output
Ada
Countess Lovelace
```

Parameters with defaults go last, after the ones every caller has to pass.

## Named arguments

Pass arguments by name when a call would otherwise be a row of mystery values. Named arguments can come in any order:

```osl
def resize(int width, int height, boolean keepRatio = true) string -> `${width}x${height} ${keepRatio}`

log resize(800, 600)
log resize(height = 600, width = 800, keepRatio = false)
```

```output
800x600 true
800x600 false
```

A call is either all positional or all named.

## Any number of arguments

A last parameter written `type ...name` collects every remaining argument into an array. `...` at a call does the reverse, spreading an array out into arguments:

```osl
def average(number ...values) number -> values.sum() / values.len

log average(2, 4, 9)
number[] marks = [70, 80, 90]
log average(...marks)
```

```output
5
80
```

## Returning more than one thing

Return an array or an object and destructure it at the call:

```osl
def minMax(int[] values) int[] -> [values.min(), values.max()]

[int low, int high] = minMax([7, 2, 9, 4])
log low high
```

```output
2 9
```

For anything more than two values, a [struct](structs.md) gives each one a name and a type.

## Calling: no space before the bracket

A call's `(` touches the function's name: `greet("Ada")`. That's what tells a call apart from a command like `log`, which takes its values after a space. `greet ("Ada")` is a syntax error.

## Functions are values

A function's name without brackets is the function itself. You can store it, pass it to another function, and call it later:

```osl
def double(int n) int -> n * 2

def applyTwice(int value, def(int) int step) int -> step(step(value))

log applyTwice(5, double)
log [1, 2, 3].map(double)
```

```output
20
[2,4,6]
```

`def(int) int` is the type of a function that takes an `int` and returns an `int`. Functions you write on the spot, without a name, are the subject of the [next lesson](lambdas.md).

## Async functions

Write `async` in place of `def` and calling the function runs its body on another thread. The call returns at once with a thread handle, and `.wait()` gives the value:

```osl
async slowDouble(int n) int (
  thread.sleep(50)
  return n * 2
)

auto job = slowDouble(21)
log "started"
log job.wait()
```

```output
started
42
```

The [concurrency lesson](concurrency.md) covers waiting for several at once, errors and timeouts.

:::quiz
Which line defines a function that takes a number and returns its double?

- [x] `def double(number n) number -> n * 2`
- [ ] `def double(n: number): number -> n * 2`
- [ ] `function double(number n) { return n * 2 }`

Types come first in OSL, for parameters and variables alike, and the return type follows the brackets.
:::

:::exercise title="Temperature converter"
Write `toFahrenheit`, which turns degrees Celsius into Fahrenheit: multiply by 9, divide by 5, then add 32.

```osl
def toFahrenheit(number celsius) number -> celsius

log toFahrenheit(0)
log toFahrenheit(100)
log toFahrenheit(37)
```

```output
32
212
98.6
```

> [!hint]
> OSL works out mixed arithmetic from left to right, so `celsius * 9 / 5 + 32` happens to be right, but brackets make it clear: `((celsius * 9) / 5) + 32`.

```osl solution
def toFahrenheit(number celsius) number -> ((celsius * 9) / 5) + 32

log toFahrenheit(0)
log toFahrenheit(100)
log toFahrenheit(37)
```
:::
