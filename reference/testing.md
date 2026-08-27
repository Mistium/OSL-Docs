# Testing

`osl test` discovers files ending in `.test.osl`. With no path, it walks the current directory. Hidden directories, `vendor`, and `node_modules` are skipped.

```bash
osl test
osl test src/
osl test src/users/validation.test.osl
```

Test files are ordinary OSL programs. A thrown error or failed assertion makes the file fail.

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

The OriginChats test files use this style for domain behavior. It keeps the failure message next to the rule being tested.

## Discovery and output

The runner sorts discovered paths, compiles each file separately, and prints `PASS` or `FAIL` for each one. It returns status `1` if any file fails.
