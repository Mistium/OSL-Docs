---
description: Keep checks next to your code with test blocks, run them with osl test, and write test files for bigger cases.
lesson: 21
---

# Testing

OSL builds testing into the language. A `test` block next to a function lists things that should be true, and `osl test` checks them. No framework to install, and no assertion library to learn.

## Test blocks

Write `test ( ... )` at the top level of a file. Every line inside that's a boolean is checked:

```osl norun
def clamp(number value, number low, number high) number -> min(high, max(low, value))

test (
  clamp(-1, 0, 10) == 0
  clamp(5, 0, 10) == 5
  clamp(11, 0, 10) == 10
)
```

Run the checks for a file, a folder, or the whole project:

```bash
osl test clamp.osl
osl test src/
osl test
```

```text
PASS clamp.osl:3
1 passed
```

When a check fails, you see which line, and the values on both sides of the comparison:

```text
FAIL clamp.osl:3
  clamp.osl:5: clamp(5, 0, 10) == 5
    left:  0
    right: 5
```

`osl run` and `osl compile` leave test blocks out completely, so they cost nothing in the program you ship.

## Loops and setup in tests

A test block is ordinary code. Declare data, loop over cases, call functions; every boolean line, even inside a loop or an `if`, is a check:

```osl norun
def isLeapYear(int year) boolean (
  if year % 400 == 0 return true
  if year % 100 == 0 return false
  return year % 4 == 0
)

test (
  for year in [1996, 2000, 2024] (
    isLeapYear(year)
  )
  for year in [1900, 2023, 2100] (
    !isLeapYear(year)
  )
)
```

Each block has its own variables. Blocks in one file share the file's globals and run in order.

## Testing failures

A test that expects an error can check the result:

```osl norun
def parsePort(string text) result<int, error> -> text.tryAs<int>

test (
  parsePort("8080").unwrap() == 8080
  parsePort("eighty").isErr()
)
```

A `throw` inside a test block fails that block, and the next block still runs.

## Assertions with messages

When a plain comparison doesn't say enough, [`std:testing`](../packages/testing.md) has assertions that take a message:

```osl norun
import "std:testing"

def average(number[] values) number -> values.sum() / values.len

test (
  testing.equal(average([2, 4]), 3, "average of two values")
  testing.near(average([1, 2, 2]), 1.667, 0.001)
)
```

## Test files

For bigger tests, put them in a file whose name ends in `.test.osl`. It's an ordinary program, found by `osl test`, which fails if the program throws:

```text
src/
  pricing.osl
  pricing.test.osl
```

```osl norun
import "std:testing"

testing.equal(1 + 1, 2)
log "all good"
```

## What to test

- **Pure functions** first: anything that takes values and returns a value is easy to test with a block right underneath it.
- **Edge cases**: empty arrays, zero, negative numbers, text with spaces, the last day of the month.
- **Bugs you've fixed**: add a check that would have caught it, so it can't come back.

:::quiz
What happens to `test` blocks when you `osl compile` a program?

- [ ] They run once at startup.
- [x] They're left out of the program entirely.
- [ ] Compilation fails until they pass.

Only `osl test` runs them. Shipped programs don't include them.
:::

:::exercise title="Write the checks"
`slug` should turn a title into a URL slug. Add a test block with at least three checks. This page can't run `osl test`, so the starter prints the results instead: make them all print `true`.

```osl
def slug(string title) string -> title.trim().toLower().replace(" ", "-")

log slug("Hello World") == "hello-world"
log slug("  OSL  ") == "osl"
log slug("a b c") == "a-b-c"
```

```output
true
true
true
```

> [!hint]
> The function already works. On your machine, move the three comparisons into `test ( ... )` and run `osl test`.

```osl solution
def slug(string title) string -> title.trim().toLower().replace(" ", "-")

log slug("Hello World") == "hello-world"
log slug("  OSL  ") == "osl"
log slug("a b c") == "a-b-c"
```
:::
