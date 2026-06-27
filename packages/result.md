# result

> Success/error result values

Use `result` to return either a success value or an error value from APIs that should not throw immediately.

```javascript
import "osl/result"
```

## Example

```javascript
import "osl/result"

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
| `value.unwrap()` | `any` | Returns the contained value or fails. |
| `value.unwrapOr(def: any)` | `any` | Returns the contained value or a fallback. |
| `value.expect(msg: any)` | `any` | Returns the contained value or fails with a custom message. |
| `value.unwrapErr()` | `any` | Returns the error value or fails. |
| `value.expectErr(msg: any)` | `any` | Runs the expect err operation. |
| `value.fromGo(val: any, err: error)` | `*Result` | Creates from go. |

## Notes

- Standard-library imports accept both `import "osl/result"` and `import "result"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
