# semver

> Semantic-version parsing and comparison

Use `semver` to parse, compare, bump, sort, and test semantic version strings and ranges.

```javascript
import "std:semver"
```

## Example

```javascript
import "std:semver"

log semver.compare("1.2.0", "1.1.9")
log semver.satisfies("1.2.3", ">=1.0.0")
```

## API reference

### `semver`

| Method | Returns | Description |
| --- | --- | --- |
| `semver.parse(v: any)` | `object` | Parses input data. |
| `semver.isValid(v: any)` | `boolean` | Reports whether the input is valid. |
| `semver.compare(a: any, b: any)` | `number` | Runs the compare operation. |
| `semver.gt(a: any, b: any)` | `boolean` | Runs the gt operation. |
| `semver.lt(a: any, b: any)` | `boolean` | Runs the lt operation. |
| `semver.gte(a: any, b: any)` | `boolean` | Runs the gte operation. |
| `semver.lte(a: any, b: any)` | `boolean` | Runs the lte operation. |
| `semver.eq(a: any, b: any)` | `boolean` | Runs the eq operation. |
| `semver.neq(a: any, b: any)` | `boolean` | Runs the neq operation. |
| `semver.satisfies(v: any, constraint: any)` | `boolean` | Runs the satisfies operation. |
| `semver.inc(v: any, part: any)` | `string` | Runs the inc operation. |
| `semver.sort(arr: any)` | `array` | Returns a semantically sorted copy of the input. |
| `semver.max(arr: any)` | `string` | Returns the greatest version, or an empty string for an empty input. |
| `semver.min(arr: any)` | `string` | Returns the least version, or an empty string for an empty input. |

## Notes

- Prefer `import "std:semver"`; the older `import "osl/semver"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Parsing and comparison cover prerelease identifiers, build metadata, leading
zeros, malformed versions, and range boundaries. Identifiers use SemVer's ASCII
letters, digits, and hyphen rules without a regular-expression dependency. All
ordinary range operators share one validated comparison path.
