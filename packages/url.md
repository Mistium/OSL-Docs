# url

> URL parsing, building and query-string utilities

```javascript
import "osl/url"
```

## Methods

- `url.parse(raw)` → `object`
- `url.build(parts)` → `string`
- `url.encode(m)` → `string`
- `url.decode(query)` → `object`
- `url.escape(s)` → `string`
- `url.unescape(s)` → `string`
- `url.isValid(raw)` → `boolean`
- `url.join(base, ref)` → `string`
- `url.withParams(raw, params)` → `string`
- `url.param(raw, key)` → `string`
