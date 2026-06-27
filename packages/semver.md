# semver

> Semantic-version parsing and comparison

Use `semver` to parse, compare, bump, sort, and test semantic version strings and ranges.

```javascript
import "osl/semver"
```

## Example

```javascript
import "osl/semver"

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
| `semver.sort(arr: any)` | `array` | Runs the sort operation. |
| `semver.max(arr: any)` | `string` | Runs the max operation. |
| `semver.min(arr: any)` | `string` | Runs the min operation. |

## Notes

- Standard-library imports accept both `import "osl/semver"` and `import "semver"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
