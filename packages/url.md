# url

> URL parsing, building and query-string handling

Use `url` for parsing, building, joining, escaping, and editing URLs and query strings.

```javascript
import "osl/url"
```

## Example

```javascript
import "osl/url"

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

- Standard-library imports accept both `import "osl/url"` and `import "url"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Parsing preserves encoded paths and repeated query keys while rejecting
malformed escapes and invalid ports.
