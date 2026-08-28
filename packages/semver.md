# semver

Use `semver` to parse, compare, bump, sort, and test semantic version strings and ranges.

```osl
import "std:semver"
```

## Example

```osl
import "std:semver"

log semver.compare("1.2.0", "1.1.9")
log semver.satisfies("1.2.3", ">=1.0.0")
```

## API reference

### `semver`

| Method | Returns | Notes |
| --- | --- | --- |
| `semver.parse(v: any)` | `object` | Parses input data. |
| `semver.isValid(v: any)` | `boolean` |  |
| `semver.compare(a: any, b: any)` | `number` |  |
| `semver.gt(a: any, b: any)` | `boolean` |  |
| `semver.lt(a: any, b: any)` | `boolean` |  |
| `semver.gte(a: any, b: any)` | `boolean` |  |
| `semver.lte(a: any, b: any)` | `boolean` |  |
| `semver.eq(a: any, b: any)` | `boolean` |  |
| `semver.neq(a: any, b: any)` | `boolean` |  |
| `semver.satisfies(v: any, constraint: any)` | `boolean` |  |
| `semver.inc(v: any, part: any)` | `string` |  |
| `semver.sort(arr: any)` | `array` | Returns a semantically sorted copy of the input. |
| `semver.max(arr: any)` | `string` | Returns the greatest version, or an empty string for an empty input. |
| `semver.min(arr: any)` | `string` | Returns the least version, or an empty string for an empty input. |

## Notes

- Prefer `import "std:semver"`; the older `import "osl/semver"` spelling remains supported.

## Behavior and limits

Parsing follows SemVer rules for prerelease identifiers, build metadata, leading zeros, and ASCII
identifier characters. Malformed versions and ranges return failure values. Range boundaries use
the same comparison rules as direct version comparisons.
