# requests

Use `requests` to send HTTP requests and read their responses, whole or as streams of lines and
server-sent events.

```osl
import "std:requests"
```

## Example

```osl
import "std:requests"

object res = requests.get("https://httpbin.org/get", {query: {page: 2}})
log res.status
log res.headers["Content-Type"]

if !res.ok (
  log "request failed with " ++ res.statusText
)
```

A request returns `result<Response, error>`. Used as a value it unwraps itself and throws when no
response arrives. An HTTP error status such as 404 is still a response, with `ok` set to `false`.

To handle a failed connection yourself, use `catch`:

```osl
import "std:requests"

object res = requests.post("https://httpbin.org/post", {json: {name: "ada"}, timeout: 5000}) catch (err) (
  log err.kind ++ ": " ++ err.message
  return
)
log res.status
```

## API reference

### `requests`

| Method | Returns | Notes |
| --- | --- | --- |
| `requests.request(method: string, url: string, options?)` | `result<Response, error>` | Sends a request with any method and reads the whole response. |
| `requests.get(url: string, options?)` | `result<Response, error>` | Sends a GET request. |
| `requests.post(url: string, options?)` | `result<Response, error>` | Sends a POST request, usually with a `body` or `json` option. |
| `requests.put(url: string, options?)` | `result<Response, error>` | Sends a PUT request. |
| `requests.patch(url: string, options?)` | `result<Response, error>` | Sends a PATCH request. |
| `requests.delete(url: string, options?)` | `result<Response, error>` | Sends a DELETE request. |
| `requests.options(url: string, options?)` | `result<Response, error>` | Sends an OPTIONS request. |
| `requests.head(url: string, options?)` | `result<Response, error>` | Sends a HEAD request; the body is empty. |
| `requests.stream(method: string, url: string, options?)` | `result<*requests.Stream, error>` | Returns as soon as the response headers arrive, so the body can be read while the server is still sending it. |

### Options

| Key | Type | Notes |
| --- | --- | --- |
| `headers` | `object` | Request headers. |
| `query` | `object` | Added to the URL's query string. An array value repeats the key. |
| `body` | `string`, `byte[]`, `object` or `array` | Strings and bytes are sent as is; objects and arrays are sent as JSON. |
| `json` | `any` | Sent as JSON with `Content-Type: application/json`. |
| `timeout` | `number` | Limit for the whole request in milliseconds. Default 30000 (for `stream`, 0). 0 waits forever. For `stream` it also covers reading the body. |
| `maxBytes` | `number` | Largest response body accepted. Default 16 MiB. Not used by `stream`. |

Unknown keys throw `ValueError`.

### Response

| Key | Type | Notes |
| --- | --- | --- |
| `status` | `int` | HTTP status code, such as `200`. |
| `ok` | `boolean` | `true` for a 2xx status. |
| `statusText` | `string` | Status text, such as `"OK"`. |
| `url` | `string` | Final URL after redirects. |
| `headers` | `string[string]` | Canonical header name (`"Content-Type"`) to value. Repeated headers are joined with `", "`. |
| `body` | `string` | Response body. |

Redirects are followed.

### `*requests.Stream`

| Method | Returns | Notes |
| --- | --- | --- |
| `stream.status()` | `int` | HTTP status code. |
| `stream.ok()` | `boolean` | Whether the status is 2xx. |
| `stream.headers()` | `string[string]` | Response headers, as in a response. |
| `stream.lines()` | `iter<string>` | Body lines without line endings, ending when the server finishes the body. |
| `stream.events()` | `iter<{event, data, id}>` | Server-sent events (`text/event-stream`). `event` is the event type (`"message"` unless the server names one), `data` joins the data lines with `"\n"`, `id` is the last event id seen (`""` if none). Comments and retry fields are skipped. |
| `stream.close()` | `result<unit, error>` | Stops reading and releases the connection. Closing twice is a no-op. |

Several loops and threads can share one stream; each line or event goes to one of them. Iterating
throws `TimeoutError` or `NetworkError` when reading fails, and `StateError` once the stream is
closed.

```osl
import "std:requests"

*requests.Stream stream = requests.stream("GET", "https://httpbin.org/stream/3")
for line in stream.lines() (
  log line
)
stream.close()
```

A sentinel payload such as `"[DONE]"` is yielded like any other event, so check for it yourself:

```osl
import "std:requests"

*requests.Stream stream = requests.stream("POST", "https://example.com/v1/chat", {json: {stream: true}})
for event in stream.events() (
  if event.data == "[DONE]" break
  log event.data
)
stream.close()
```

### Errors

| Kind | When |
| --- | --- |
| `NetworkError` | The connection fails or is refused. |
| `NotFoundError` | The host doesn't resolve. |
| `TimeoutError` | `timeout` passed. |
| `ParseError` | The URL is malformed. |
| `UnsupportedError` | The scheme is not `http` or `https`. |
| `IOError` | The body is larger than `maxBytes`. |

## Changes from earlier versions

`timeout` is now in milliseconds and replaces `timeoutMs`; the old seconds-based `timeout`,
`params` and `max_bytes` are gone (use `query` and `maxBytes`). Responses no longer have `success`,
`error` or `raw`: handle failures with `catch` and check `ok` for a 2xx status. `stream.readLine()`
and `stream.readEvent()` are replaced by `stream.lines()` and `stream.events()`.
