# requests

> HTTP client (`get`/`post`/`put`/…)

Use `requests` for HTTP client calls that return status, headers, body text, and decoded response data.

```javascript
import "osl/requests"
```

## Example

```javascript
import "osl/requests"

auto res = requests.get("https://example.com")
log res["status"]
```

## API reference

### `requests`

| Method | Returns | Description |
| --- | --- | --- |
| `requests.Request(method: any, url: any, ...data: object)` | `object` | Sends an HTTP request. |
| `requests.get(url: any, ...data: object)` | `object` | Sends an HTTP GET request. |
| `requests.post(url: any, data: object)` | `object` | Sends an HTTP POST request. |
| `requests.put(url: any, data: object)` | `object` | Sends an HTTP PUT request. |
| `requests.patch(url: any, data: object)` | `object` | Sends an HTTP PATCH request. |
| `requests.delete(url: any, ...data: object)` | `object` | Sends an HTTP DELETE request. |
| `requests.options(url: any, ...data: object)` | `object` | Sends an HTTP OPTIONS request. |
| `requests.head(url: any, ...data: object)` | `object` | Sends an HTTP HEAD request. |

## Notes

- Standard-library imports accept both `import "osl/requests"` and `import "requests"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
