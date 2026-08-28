# requests

Use `requests` for HTTP client calls that return status, headers, body text, and actionable transport errors.

```osl
import "std:requests"
```

## Example

```osl
import "std:requests"

auto res = requests.get("https://example.com")
log res["status"]
```

## API reference

### `requests`

| Method | Returns | Notes |
| --- | --- | --- |
| `requests.Request(method: any, url: any, ...data: object)` | `object` | Sends an HTTP request. |
| `requests.get(url: any, ...data: object)` | `object` | Sends an HTTP GET request. |
| `requests.post(url: any, data: object)` | `object` | Sends an HTTP POST request. |
| `requests.put(url: any, data: object)` | `object` | Sends an HTTP PUT request. |
| `requests.patch(url: any, data: object)` | `object` | Sends an HTTP PATCH request. |
| `requests.delete(url: any, ...data: object)` | `object` | Sends an HTTP DELETE request. |
| `requests.options(url: any, ...data: object)` | `object` | Sends an HTTP OPTIONS request. |
| `requests.head(url: any, ...data: object)` | `object` | Sends an HTTP HEAD request. |
| `requests.stream(method: any, url: any, ...data: object)` | `*requestsStream` | Opens a bounded streaming response with idempotent close. |

## Notes

Optional `headers`, `params`, `body`, `timeout`, and `max_bytes` values use the same request-construction
path for regular, HEAD, and streaming requests. Positive timeouts are capped at 300 seconds.
Regular responses default to a 16 MiB body limit; `max_bytes` can raise it up to 1 GiB. Use
`requests.stream` when the response should not be buffered in memory.
Concurrent reads from one stream are serialized in arrival order, while `close` can still unblock
a pending read.
Regular request results include `error`, which is empty on success and describes malformed URLs,
connection failures, timeouts, and response-read failures when `success` is `false`.

- Prefer `import "std:requests"`; the older `import "osl/requests"` spelling remains supported.
- `requests` can be imported alongside `osl/url` in the same program.

## Behavior and limits

Requests honor finite timeouts. URL, transport, timeout, and body-read failures set `success` to
`false` and put the cause in `error`. A response stream can be closed more than once. The SSE parser
accepts multiline events and a final event without a trailing blank line.
