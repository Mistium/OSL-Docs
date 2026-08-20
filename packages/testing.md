# testing

> Assertions for OSL test files

The `testing` package provides assertion helpers that stop the current test with an
`AssertionError`. Test files end in `.test.osl` and can be run with `osl test`. Reserve that suffix for executable assertion suites; name ordinary demos
and manually run programs with the plain `.osl` suffix so test discovery does not run them.

```javascript
import "std:testing"

testing.equal(2 + 2, 4)
testing.assert("hello".contains("ell"))
```

Run every test below the current directory, or pass specific files and directories:

```bash
osl test
osl test tests/math.test.osl tests/integration
```

#### `testing.assert(condition, message?)` → `boolean`

Requires `condition` to be true. The optional message replaces the default failure text.

#### `testing.equal(actual, expected, message?)` → `boolean`

Requires the two values to be equal using OSL equality semantics. Arrays and objects are compared
by value.

```javascript
testing.equal([1, 2].map(def(n) -> ( n * 2 )), [2, 4])
```

#### `testing.notEqual(actual, expected, message?)` → `boolean`

Requires the two values not to be equal.

#### `testing.near(actual, expected, tolerance, message?)` → `boolean`

Requires two numeric values to differ by no more than `tolerance`. This is useful for floating-point
results and simulations.

```javascript
testing.near(0.1 + 0.2, 0.3, 0.000001)
```

#### `testing.isNull(value, message?)` → `boolean`

Requires `value` to be `null`.

#### `testing.notNull(value, message?)` → `boolean`

Requires `value` not to be `null`.

#### `testing.panics(fn, message?)` → `boolean`

Calls a zero-argument function and requires it to panic or throw.

```javascript
testing.panics(def() -> (
  throw "expected failure"
))
```

#### `testing.fail(message)` → `boolean`

Immediately fails with the supplied message. It is useful for branches that should be
unreachable.
