# result

> Success/error result values

Use `result` to return either a success value or an error value from APIs that should not throw immediately.

```javascript
import "std:result"
```

## Example

```javascript
import "std:result"

auto ok = result.ok(42)
log ok.unwrapOr(0)
```

## API reference

### `result`

| Method | Returns | Description |
| --- | --- | --- |
| `result.ok(v: any)` | `*Result` | Runs the ok operation. |
| `result.err(e: any)` | `*Result` | Runs the err operation. |

### `Result` values

Methods available on `Result` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.isOk()` | `boolean` | Reports whether the result is successful. |
| `value.isErr()` | `boolean` | Reports whether the result is an error. |
| `value.unwrap()` | `any` | Returns the success value through the shared variant accessor or fails. |
| `value.unwrapOr(def: any)` | `any` | Returns the contained value or a fallback. |
| `value.expect(msg: any)` | `any` | Returns the contained value or fails with a custom message. |
| `value.unwrapErr()` | `any` | Returns the error value through the shared variant accessor or fails. |
| `value.expectErr(msg: any)` | `any` | Uses the same error-side accessor with a custom failure message. |
| `value.fromGo(val: any, err: error)` | `*Result` | Creates from go. |

## Notes

- Prefer `import "std:result"`; the older `import "osl/result"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
