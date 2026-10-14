# testing

The `testing` package provides assertions that stop the current test with an `AssertionError`
naming what went wrong. Standalone test files end in `.test.osl` and run with `osl test`. Ordinary
`.osl` source files can also contain [inline `test (...)` blocks](../reference/testing.md#inline-checks),
whose bare boolean expressions are checked without importing this package. Files with neither test
blocks nor the `.test.osl` suffix are left out of discovery.

```osl
import "std:testing"

testing.equal(2 + 2, 4)
testing.assert("hello".contains("ell"))

error err = testing.throws(def() -> (
  throw error("ValueError", "width must be >= 0")
))
testing.equal(err.kind, "ValueError")
```

Run every test below the current directory, or pass specific files and directories:

```bash
osl test
osl test tests/math.test.osl tests/integration
```

## API reference

Every assertion takes an optional final `message`, which replaces the default failure text. An
assertion that passes returns `true`.

| Method | Returns | Notes |
| --- | --- | --- |
| `testing.assert(condition: boolean, message?)` | `boolean` | Fails unless `condition` is true. |
| `testing.equal(actual, expected, message?)` | `boolean` | Fails unless the values are equal. Arrays and objects are compared by content. The failure names both values. |
| `testing.notEqual(actual, expected, message?)` | `boolean` | Fails when the values are equal. |
| `testing.near(actual: number, expected: number, tolerance: number, message?)` | `boolean` | Fails unless `actual` is within `tolerance` of `expected`, or when either is NaN. Throws `ValueError` for a negative tolerance. |
| `testing.null(value, message?)` | `boolean` | Fails unless `value` is `null`. |
| `testing.notNull(value, message?)` | `boolean` | Fails when `value` is `null`. |
| `testing.throws(fn: function, message?)` | `error` | Calls `fn` with no arguments, fails when it returns normally, and returns the error it threw so its `kind` and `message` can be checked. Throws `TypeError` when `fn` isn't a function. |
| `testing.fail(message: string)` | `boolean` | Fails at once. Use it for branches a test should never reach. |

```osl
import "std:testing"

testing.equal([1, 2].map(n -> n * 2), [2, 4])
testing.near(0.1 + 0.2, 0.3, 0.000001)
```

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `testing.isNull(value)` | `testing.null(value)`. `is*` names are predicates that never throw. |
| `testing.panics(fn)` | `testing.throws(fn)`, which also returns the error |
