# js

Use `js` to run JavaScript in a sandboxed QuickJS runtime with a hard timeout, a memory cap, and no
access to files, the network, or the program.

```osl
import "std:js"
```

## Example

```osl
import "std:js"

int sum = js.eval("[1, 2, 3].reduce((a, b) => a + b, 0)")
log sum // 6

object user = js.eval("({name: 'Ada', tags: ['x']})")
log user.name // Ada

any value = js.eval("while (true) {}", {timeout: 100}) catch (err) (
  log err // TimeoutError: js.eval: the code did not finish within 100ms
  return
)
log value
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `js.eval(code: string, options?: object)` | `result<any, error>` | Runs `code` in a fresh runtime and returns the value of its last expression. |

The value is converted through JSON: objects, arrays, strings, numbers, booleans, and `null` keep
their shape, `undefined` becomes `null`, and a promise is awaited.

Options:

| Key | Default | Meaning |
| --- | --- | --- |
| `timeout` | `60000` | Milliseconds the code may run. |
| `memoryLimit` | `1048576` | Bytes the runtime may allocate. |

## Errors

`js.eval` fails with:

- `ParseError` for a JavaScript syntax error;
- `TimeoutError` when the code runs past `timeout`;
- `RuntimeError` for an exception the code throws, or for running out of memory.

It throws `ValueError` for a `timeout` or `memoryLimit` of 0 or less.

## Changes from earlier versions

`js.evaluate` is now called `js.eval`. The old `js.eval(code, timeoutMs)`, which returned
`{success, result}` with the value as a string, is gone: pass the timeout as `{timeout: ms}`, and
handle failures with `catch`.
