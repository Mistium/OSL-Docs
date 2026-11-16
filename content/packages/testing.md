---
description: Check your code with assertions that name what went wrong, and learn how they fit with test blocks, test files and osl test.
package: testing
---

# testing

`std:testing` has the assertions: small functions that return `true` when something holds and throw an `AssertionError` that names both sides when it doesn't. Use them in test files, and in `test ( ... )` blocks when a bare comparison doesn't say enough.

## Your first assertion

An assertion that passes returns `true`. One that fails throws, which stops the program:

```osl
import "std:testing"

log testing.equal(2 + 2, 4)
log testing.assert("hello".contains("ell"))
log testing.notEqual("a", "b")
```

```output
true
true
true
```

Change `4` to `5` and run it again. The failure says `expected 4 to equal 5`.

## Seeing a failure

A failed assertion ends the program, so to look at one without stopping, wrap it in `testing.throws`. It runs a function, checks that the function throws, and gives you the error:

```osl
import "std:testing"

auto failure = testing.throws(def() ( testing.equal(1, 2) ))
log failure.kind
log failure.message
```

```output
AssertionError
expected 1 to equal 2
```

Try `testing.equal({a: [1, 2]}, {a: [1, 3]})`. Arrays and objects compare by content, and the message prints both whole.

## Adding your own message

Every assertion takes an optional last argument that replaces the default message. Write what you were checking, so a failure reads like a sentence:

```osl
import "std:testing"

auto failure = testing.throws(def() ( testing.assert(1 > 2, "a ticket needs a positive price") ))
log failure.message
```

```output
a ticket needs a positive price
```

## Floating-point numbers

`0.1 + 0.2` is not exactly `0.3` in any language that uses floating point. `testing.near(actual, expected, tolerance)` accepts a small difference:

```osl
import "std:testing"

log testing.near(0.1 + 0.2, 0.3, 0.0001)

auto failure = testing.throws(def() ( testing.near(1, 2, 0.1) ))
log failure.message
```

```output
true
expected 1 to be within 0.1 of 2
```

:::quiz
You compare `average([1, 2, 2])` to `1.667`. Which check is right?

- [ ] `testing.equal(average([1, 2, 2]), 1.667)`
- [x] `testing.near(average([1, 2, 2]), 1.667, 0.001)`
- [ ] `testing.notEqual(average([1, 2, 2]), 1.667)`

The real answer is 1.6666..., so it can never equal 1.667. `near` allows for the rounding.
:::

## Null checks

`testing.null(value)` and `testing.notNull(value)` check for `null`:

```osl
import "std:testing"

log testing.null(null)
log testing.notNull(3)
log testing.throws(def() ( testing.notNull(null) )).message
```

```output
true
true
expected value not to be null
```

## Code that should fail

`testing.throws` is also how you check that a function rejects bad input. It fails when the function returns normally:

```osl
import "std:testing"

def positive(int n) int (
  if n <= 0 throw "must be positive"
  return n
)

auto failure = testing.throws(def() ( positive(-1) ))
log failure.message

auto missed = testing.throws(def() ( testing.throws(def() -> 1) ))
log missed.kind
```

```output
must be positive
AssertionError
```

For functions that return a `result`, you don't need it: check `.isErr()` and `.unwrapErr().kind`, as [the errors lesson](../learn/errors.md) shows.

`testing.fail(message)` throws unconditionally. Put it on a branch that must never run.

## In test blocks and test files

`osl test` runs two kinds of test. A `test ( ... )` block checks every boolean line, and the assertions here are for when you want your own message:

```osl norun
import "std:testing"

def average(number[] values) number -> values.sum() / values.len

test (
  testing.equal(average([2, 4]), 3, "average of two values")
  testing.near(average([1, 2, 2]), 1.667, 0.001)
)
```

A file ending in `.test.osl` is an ordinary program that `osl test` runs and fails if it throws:

```osl norun
import "std:testing"

testing.equal(1 + 1, 2)
log "all good"
```

Test blocks are left out of `osl run` and `osl compile`, so they can't change a shipped program. See [the testing lesson](../learn/testing.md) for blocks, loops in tests and `osl test` itself.

:::quiz
What does `osl test` do with a `.test.osl` file?

- [ ] Compiles it and ignores its output.
- [x] Runs it, and reports a failure if it throws.
- [ ] Only runs the `test` blocks in it.

A test file is a normal program, so a failed assertion (a throw) is what marks it as failed.
:::

:::exercise title="Reject a bad age"
`checkAge` should throw for a negative age. Use `testing.throws` to catch the error from `checkAge(-5)`, and print its message.

```osl
import "std:testing"

def checkAge(int age) int (
  if age < 0 throw "age can't be negative"
  return age
)

log checkAge(30)
```

```output
age can't be negative
```

> [!hint]
> `testing.throws(def() ( ... ))` returns the error, which has a `message`.

```osl solution
import "std:testing"

def checkAge(int age) int (
  if age < 0 throw "age can't be negative"
  return age
)

auto failure = testing.throws(def() ( checkAge(-5) ))
log failure.message
```
:::

## API reference

::api
