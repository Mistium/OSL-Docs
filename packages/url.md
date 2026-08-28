# url

Use `url` for parsing, building, joining, escaping, and editing URLs and query strings.

```javascript
import "std:url"
```

## Example

```javascript
import "std:url"

auto u = url.parse("https://example.com?a=1")
log u["host"]
```

## API reference

### `url`

| Method | Returns | Description |
| --- | --- | --- |
| `url.parse(raw: any)` | `object` | Parses through the shared standard-library URL boundary. |
| `url.build(parts: object)` | `string` | Builds a URL using the same scalar and repeated query-value applicator as `encode` and `withParams`. |
| `url.encode(m: object)` | `string` | Encodes scalar and array query values using the shared query-value rules. |
| `url.decode(query: any)` | `object` | Decodes a URL-encoded query string into an object. |
| `url.escape(s: any)` | `string` | Runs the escape operation. |
| `url.unescape(s: any)` | `string` | Runs the unescape operation. |
| `url.isValid(raw: any)` | `boolean` | Uses the shared parser and requires both scheme and host. |
| `url.join(base: any, ref: any)` | `string` | Runs the join operation. |
| `url.withParams(raw: any, params: object)` | `string` | Adds or replaces scalar and repeated query values using the same rules as `encode`. |
| `url.param(raw: any, key: any)` | `string` | Runs the param operation. |

## Notes

- Prefer `import "std:url"`; the older `import "osl/url"` spelling remains supported.

## Edge-case behavior

Parsing preserves encoded paths and repeated query keys while rejecting
malformed escapes and invalid ports.
