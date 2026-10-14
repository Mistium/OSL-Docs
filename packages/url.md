# url

Use `url` to parse, build, resolve, and escape URLs and query strings.

```osl
import "std:url"
```

## Example

```osl
import "std:url"

auto u = url.parse("https://example.com:8443/docs?tag=x&tag=y#top")
log u.hostname  // example.com
log u.port      // 8443
log u.query.tag // ["x","y"]

string page = url.param("https://example.com/?page=2", "page") ?? "1"
log page        // 2

log url.withParams("https://example.com/search?q=old", {q: "new words", lang: "en"})
// https://example.com/search?lang=en&q=new+words
log url.join("https://x.com/a/", "b") // https://x.com/a/b
```

## API reference

### `url`

| Function | Returns | Notes |
| --- | --- | --- |
| `url.parse(text: string)` | `result<url.Parts, error>` | Splits a URL into its components. Relative references such as `"../a"` parse too. |
| `url.build(parts: object)` | `string` | Assembles a URL from the keys `url.parse` returns. Every key is optional. Throws `ValueError` for an unknown key. `url.build(url.parse(u))` gives the URL back. |
| `url.isValid(text: string)` | `boolean` | Whether the text is an absolute URL with a scheme and a host, such as `"https://example.com"`. |
| `url.join(base: string, ref: string)` | `result<string, error>` | Resolves a relative reference against a base URL, as a browser resolves a link. |
| `url.param(url: string, key: string)` | `result<string?, error>` | The first value of a query parameter, or `null` when it is absent. |
| `url.withParams(url: string, params: object)` | `result<string, error>` | Sets query parameters, replacing existing values for those keys and keeping the others. An array value repeats the key. |
| `url.parseQuery(text: string)` | `result<object, error>` | Reads a query string such as `"a=1&b=two+words"` (a leading `?` is allowed). Each key maps to its decoded value, or to an array when the key repeats. |
| `url.stringifyQuery(params: object)` | `string` | Encodes an object as a query string with sorted keys. An array value repeats the key; other values become strings. |
| `url.escape(text: string)` | `string` | Percent-encodes text for a query key or value, writing spaces as `+`. |
| `url.unescape(text: string)` | `result<string, error>` | Decodes a percent-encoded query component, turning `+` into a space. |

### URL parts

`url.parse` returns a `url.Parts` record. `url.build` accepts the same keys.

| Key | Type | Meaning |
| --- | --- | --- |
| `scheme` | `string` | `"https"` |
| `host` | `string` | Host and port, `"example.com:8443"`. `build` uses `hostname` and `port` when `host` is absent. |
| `hostname` | `string` | `"example.com"` |
| `port` | `string` | `"8443"` |
| `path` | `string` | The decoded path. |
| `rawPath` | `string` | The path with its escapes kept. |
| `query` | `object` | Each query key mapped to its value, or to an array when the key repeats. |
| `queryString` | `string` | The query as written, without `?`. `build` uses it when `query` is absent. |
| `fragment` | `string` | The text after `#`. |
| `user`, `password` | `string` | Credentials from `user:password@`. |

Every string key is `""` when the URL has no such part.

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `parse`, `param`, `withParams`, `join` | `ParseError` | A malformed URL, such as a bad percent-escape or port. |
| `parseQuery`, `unescape` | `ParseError` | A bad percent-escape. `parseQuery` also rejects `;` separators. |
| `join` | `ValueError` | `ref` names its own scheme or host (`"https://other.example"`, `"//other.example"`). The result always stays on the base URL's origin. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `url.encode(params)` | `url.stringifyQuery(params)` |
| `url.decode(text)` (returns `{}` for malformed input) | `url.parseQuery(text)` (fails with `ParseError`) |
| The `valid` key of `url.parse` (always `true` now) | `url.isValid(text)`. A malformed URL fails `parse` with `ParseError`. |

## Behavior and limits

- Parsing keeps encoded paths (in `rawPath`) and repeated query keys.
- The older `import "osl/url"` spelling still works with a migration warning.
