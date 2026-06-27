# semver

> Semantic version parsing, comparison and range matching

```javascript
import "osl/semver"
```

## Methods

- `semver.parse(v)` → `object`
- `semver.isValid(v)` → `boolean`
- `semver.compare(a, b)` → `number`
- `semver.gt(a, b)` → `boolean`
- `semver.lt(a, b)` → `boolean`
- `semver.gte(a, b)` → `boolean`
- `semver.lte(a, b)` → `boolean`
- `semver.eq(a, b)` → `boolean`
- `semver.neq(a, b)` → `boolean`
- `semver.satisfies(v, constraint)` → `boolean`
- `semver.inc(v, part)` → `string`
- `semver.sort(arr)` → `array`
- `semver.max(arr)` → `string`
- `semver.min(arr)` → `string`
