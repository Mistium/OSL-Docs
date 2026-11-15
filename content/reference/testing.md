---
description: How test blocks and .test.osl files work, what osl test finds and prints, the assertions in std:testing, and how tests stay out of built programs.
---

# Testing reference

OSL has two kinds of tests: `test ( ... )` blocks that sit next to the code they check, and standalone `.test.osl` programs for bigger cases. `osl test` finds both, runs them, and fails with exit status 1 if any check fails. This page is the complete description. The [testing lesson](../learn/testing.md) is the gentler introduction.

## Test blocks

A `test ( ... )` block is a top-level statement in any `.osl` file. Every line inside that is a boolean expression is a check. A check that is `false` fails the block, and the report shows both sides of a comparison.

```osl norun
def clamp(number value, number low, number high) number -> min(high, max(low, value))

test (
  clamp(-1, 0, 10) == 0
  clamp(5, 0, 10) == 5
  clamp(11, 0, 10) == 10
)
```

The rules:

- A line that is a bare expression must be a boolean. Any other type is a compile error that tells you to compare it with the value you expect.
- To run something without checking it, write `void` before it: `void items.append(3)`.
- A comparison evaluates each side once, and uses the same equality and ordering rules as the rest of the language.
- The block is ordinary code. It can declare variables, loop and branch, and every boolean line, even one inside a `for` or an `if`, is a check.
- A block has its own variables. Blocks in one file see the file's top-level declarations, and run in the order they appear.
- A check that fails stops its block. The next block still runs.
- A `throw` inside a block also fails it, with the thrown error's kind and message. The next block still runs.

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

### Testing failures

A result can be checked without unwrapping it:

```osl norun
def parsePort(string text) result<int, error> -> text.tryAs<int>

test (
  parsePort("8080").unwrap() == 8080
  parsePort("eighty").isErr()
  parsePort("eighty").unwrapErr().kind == "ParseError"
)
```

## Assertions with std:testing

When a plain comparison doesn't say enough, [`std:testing`](../packages/testing.md) has functions that name what went wrong and take an optional message. Each returns `true` when it passes and throws an `AssertionError` when it does not, so on a line of their own they work as checks.

| Function | Passes when |
| --- | --- |
| `testing.assert(condition, message...)` | `condition` is true. |
| `testing.equal(actual, expected, message...)` | The two values are equal. |
| `testing.notEqual(actual, expected, message...)` | The two values differ. |
| `testing.near(actual, expected, tolerance, message...)` | The numbers are within `tolerance` of each other. |
| `testing.null(value, message...)` | The value is `null`. |
| `testing.notNull(value, message...)` | The value is not `null`. |
| `testing.throws(fn, message...)` | Calling `fn` throws. Returns the error, so put `void` in front when you don't use it. |
| `testing.fail(message)` | Never: it always fails. Use it for a branch that must not be reached. |

```osl norun
import "std:testing"

def average(number[] values) number -> values.sum() / values.len

test (
  testing.equal(average([2, 4]), 3, "average of two values")
  testing.near(average([1, 2, 2]), 1.667, 0.001)
  void testing.throws(def() -> ( throw error("boom") ))
)
```

## Test files

A file whose name ends in `.test.osl` is a program of its own. `osl test` compiles and runs it, and it passes when the program finishes without throwing. Use it when a test needs a lot of setup, files, or a server.

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

A `.test.osl` file is never imported by other files, even by a folder import, so it can sit next to the code it tests.

## Running tests

```sh
osl test                       # every test under the current folder
osl test src/                  # every test under a folder
osl test src/pricing.osl       # one file with test blocks
osl test src/pricing.test.osl  # one test file
```

`osl test` takes paths and nothing else: it has no flags. A path must be a folder, a file with at least one `test` block, or a `.test.osl` file. Without a path it walks the current folder, skipping hidden folders, `vendor` and `node_modules`. If it finds nothing, it prints `No OSL test files found.` and exits with 0.

Files with test blocks in the same project (the folder that holds the nearest `opal.json`) are built together once, then run one file at a time, a few in parallel. Each `.test.osl` file is built and run on its own, one after another. Set `OSL_TEST_JOBS` to change how many test files run in parallel. Warnings from compiling are printed before the results.

### What it prints

Each block that passes prints `PASS` with the file and the line the block starts on. Each `.test.osl` file prints one `PASS` with its path. The last line counts files, not blocks.

```text
PASS src/pricing.osl:12
PASS src/pricing.osl:20
PASS src/pricing.test.osl

2 passed, 0 failed
```

A failing block prints `FAIL` with the file, then the failing check with the values on each side, the source line, and where the block starts:

```text
FAIL src/pricing.osl
FAIL src/pricing.osl:12
AssertionError: discount(100, 10) == 91 (left=90, right=91)
   |
 14 | discount(100, 10) == 91
   | ^^^^^^^^^^^^^^^^^^^^^^^
in: src/pricing.osl:14
at: src/pricing.osl:12
PASS src/pricing.osl:20

0 passed, 1 failed
```

A file counts as failed when any of its blocks fails. A file that does not compile prints `FAIL` and the compile error.

### Exit status

| Status | Meaning |
| --- | --- |
| `0` | Every file passed, or there were no tests. |
| `1` | A test failed, a test file did not compile, or a path could not be used. |

That makes `osl test` a drop-in CI step. Add it to a project's scripts so `opal run test` works anywhere:

```json
{
  "scripts": { "test": ["osl", "test"] }
}
```

## Tests are not in your program

`osl run`, `osl compile` and `osl transpile` leave `test` blocks out completely, and `.test.osl` files are never part of a build. Nothing in a test costs anything in the program you ship, so tests can sit right beside the code, and can use `std:testing` without adding it to the finished program.

## What to test

- Pure functions first: anything that takes values and returns a value is easy to check with a block directly under it.
- Edge cases: empty arrays, zero, negative numbers, text with spaces, the last day of the month.
- Every bug you fix: add a check that would have caught it.
- Failures as well as successes: check that bad input produces an error of the kind you promise.

## See also

- [Testing lesson](../learn/testing.md)
- [std:testing](../packages/testing.md)
- [Command line](cli.md#test)
