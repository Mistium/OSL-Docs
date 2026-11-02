# requests

Use `requests` for HTTP client calls that return status, headers, body text, and actionable transport errors.

```osl
import "std:requests"
```

## Example

```osl
import "std:requests"

auto res = requests.get("https://example.com") catch return
log res.status
```

## Parsing JSON bodies

`response.parse<T>()` parses the body as JSON and checks it against `T`, the same way
`json.parse<T>(response.body)` does, and gives `result<T, error>`. Keys `T` doesn't declare are
ignored. You don't need to import `std:json` for it, and a string has the same `parse<T>()`.

```osl
import "std:requests"

type User (
  string name
  int id
)

def lookup(string username) User[] (
  auto response = requests.get(`https://example.com/users/${username}`) catch return []
  return response.parse<User[]>() catch return []
)
```

Called on the request's result, as in `requests.get(url).parse<User[]>()`, a request that got no
response passes its error through, so one `catch` handles both failures. A body that isn't JSON fails
with `ParseError`, and JSON of the wrong shape fails with `TypeError`. A 4xx or 5xx response still has
a body, so check `response.ok` first when an error page shouldn't be parsed.

## API reference

### `requests`

| Method | Returns | Notes |
| --- | --- | --- |
| `requests.request(method: any, url: any, ...data: object)` | `object` | Sends an HTTP request. |
| `requests.get(url: any, ...data: object)` | `object` | Sends an HTTP GET request. |
| `requests.post(url: any, data: object)` | `object` | Sends an HTTP POST request. |
| `requests.put(url: any, data: object)` | `object` | Sends an HTTP PUT request. |
| `requests.patch(url: any, data: object)` | `object` | Sends an HTTP PATCH request. |
| `requests.delete(url: any, ...data: object)` | `object` | Sends an HTTP DELETE request. |
| `requests.options(url: any, ...data: object)` | `object` | Sends an HTTP OPTIONS request. |
| `requests.head(url: any, ...data: object)` | `object` | Sends an HTTP HEAD request. |
| `requests.stream(method: any, url: any, ...data: object)` | `*requests.Stream` | Opens a bounded streaming response with idempotent close. |

## Notes

Optional `headers`, `params`, `body`, `timeout`, and `max_bytes` values use the same request-construction
path for regular, HEAD, and streaming requests. Positive timeouts are capped at 300 seconds.
Regular responses default to a 16 MiB body limit; `max_bytes` can raise it up to 1 GiB. Use
`requests.stream` when the response should not be buffered in memory.
Concurrent reads from one stream are serialized in arrival order, while `close` can still unblock
a pending read.
A request that gets no response, such as a malformed URL, a refused connection, a timeout or a failed
body read, fails as a result; handle it with `catch`.

- Prefer `import "std:requests"`; the older `import "osl/requests"` spelling remains supported.
- `requests` can be imported alongside `osl/url` in the same program.

## Behavior and limits

Requests honor finite timeouts. A response stream can be closed more than once. The SSE parser
accepts multiline events and a final event without a trailing blank line.
