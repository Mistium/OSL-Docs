# option

> Optional values — a value that may or may not be present

An `Option` wraps a value that might be missing, as a safer alternative to `null`. Create one with the
`some(value)` and `none()` functions, then ask whether it holds a value before reading it.

```javascript
import "osl/option"
```

## Creating options

```javascript
auto found   = some(42)   // an option that holds 42
auto missing = none()     // an empty option
```

## Methods

Call these on an option value:

- `opt.isSome()` → `boolean` — does it hold a value?
- `opt.isNone()` → `boolean` — is it empty?
- `opt.unwrap()` → the value (errors if the option is empty)
- `opt.unwrapOr(default)` → the value, or `default` if empty
- `opt.expect(message)` → the value, or fails with `message` if empty

## Example

```javascript
import "osl/option"

def find(array names, string target) (
  for i names.len (
    if names[i] == target (
      return some(i)
    )
  )
  return none()
)

auto result = find(["a", "b", "c"], "b")

if result.isSome() (
  log "found at index " ++ result.unwrap()
) else (
  log "not found"
)

// Or supply a fallback:
log find(["a"], "z").unwrapOr(-1)   // -1
```

See also [`result`](result.md) for success/error values.
