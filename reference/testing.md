# Testing

`osl test` discovers top-level `test (...)` blocks in ordinary `.osl` source files and executable files ending in `.test.osl`. With no path, it walks the current directory. Hidden directories, `vendor`, and `node_modules` are skipped.

```bash
osl test
osl test src/
osl test src/users/validation.osl
osl test src/users/validation.test.osl
```

## Inline checks

Keep a small block of examples beside the implementation:

```osl
def clamp(number value, number low, number high) number (
  return min(high, max(low, value))
)

test (
  clamp(-1, 0, 10) == 0
  clamp(5, 0, 10) == 5
  clamp(11, 0, 10) == 10
)
```

Each bare expression in a test body must be boolean and is checked automatically. A false result fails the block. Comparisons report both operand values and evaluate each operand once, using the same equality and comparison rules as ordinary OSL. No assertion package is needed.

Use ordinary declarations and control flow to keep cases compact:

```osl
test (
  for row in [[-1, 0], [5, 5], [11, 10]] (
    clamp(row[1], 0, 10) == row[2]
  )
)
```

Bare boolean expressions are also checked inside the block's loops and conditional branches. Function and lambda bodies keep their ordinary semantics. Use `void` for a call whose result should be ignored, and use `defer` for cleanup. A thrown error fails the current block, runs its deferred cleanup, and lets later blocks run.

Test blocks must be at the top level. Each block has its own local scope; blocks in the same file share globals and execute in source order. Each discovered file runs in a separate process. Wait explicitly for any threads whose results the block needs.

In test mode, the compiler retains definitions, imports, and global initialization assignments while skipping top-level startup statements and the automatic `main()` call. Imported source files follow the same rule, and their test blocks are not run merely by importing them. **Global initializers still execute**, including calls made by those initializers. Put application startup in `main()` or a standalone call when it must be skipped during checks.

Imports inside a test block are available to its checks and are omitted with the block during normal compilation. `osl run`, `osl compile`, and `osl transpile` omit inline blocks and their test-only dependencies. Production and test artifacts have separate compiler cache keys.

## Standalone test files

Existing `.test.osl` files remain ordinary executable OSL programs. A thrown error or failed assertion makes the file fail. If a file contains inline blocks, it uses the inline test mode described above, regardless of its filename.

## Assertions

```osl
import "std:testing"

testing.equal(add(2, 3), 5)
testing.notEqual(status, "failed")
testing.near(measured, 10, 0.01)
testing.isNull(optional)
testing.notNull(record)
testing.assert(items.len > 0)
testing.panics(def() -> (
  throw "expected"
))
```

Each assertion accepts an optional final message. `testing.fail(message)` fails immediately.

## Direct checks

For small focused tests, direct checks and `throw` are often clearer than an assertion wrapper:

```osl
object parsed = parseInput(source)

if parsed.name != "Ada" (
  throw "parseInput should preserve the name"
)
```

This style keeps the failure message next to the rule being tested.

## Discovery and output

The runner sorts discovered paths and compiles each file separately. Inline blocks print `PASS` or `FAIL` with their source file and opening line; failures also show the failing expression's source location and values. Standalone files print `PASS` or `FAIL` for the file. The final totals count files, and status `1` means at least one file failed.

## Compiler repository checks

The compiler repository's CI runs the full suite with `go test -p 4 ./...` to limit simultaneous package builds. Tests that invoke the OSL CLI report process startup failures and timeouts even when the process produces no output.

When working in the compiler repository, enable Go's race detector for the behavioral
suites with `OSL_TEST_RACE=1`:

```bash
OSL_TEST_RACE=1 go test ./tests/language/runtime -run TestUnitThreadSafety -count=1
OSL_TEST_RACE=1 go test ./tests/language/functions -run TestRecords -count=1
```

A race report fails the batch even if individual cases already printed successful
results. A timed-out batch preserves completed results and retries unfinished cases
individually to identify the timeout.
