# semver

Use `semver` to parse, compare, bump, sort, and range-match semantic versions such as `"1.4.0-rc.1"`.

```osl
import "std:semver"
```

## Example

```osl
import "std:semver"

log semver.compare("1.2.0", "1.1.9")     // 1
log semver.satisfies("1.2.3", "^1.0.0")  // true
if semver.gt("2.0.0", "1.9.9") (
  log "newer"
)

auto v = semver.parse("v1.4.0-rc.1+build.5")
log v.major                               // 1
string pre = v.prerelease ?? ""
log pre                                   // rc.1
log semver.inc("1.4.0-rc.1", "minor")     // 1.5.0
```

Every function except `isValid` returns a `result` and fails with `ParseError` when a version isn't a semantic version. Used as a plain value, as above, the result unwraps itself and throws on failure. Use `semver.isValid` to check text from outside the program first, or `catch`, `try(...)`, or `auto` to handle the error.

## API reference

### `semver`

| Function | Returns | Notes |
| --- | --- | --- |
| `semver.parse(text: string)` | `result<semver.Version, error>` | Reads a version such as `"1.4.0-rc.1+build.5"`. A leading `v` is allowed. |
| `semver.isValid(text: string)` | `boolean` | Whether `parse` accepts the text. |
| `semver.compare(a: string, b: string)` | `result<int, error>` | `-1`, `0`, or `1` as `a` is lower than, equal to, or higher than `b`. |
| `semver.gt(a, b)`, `semver.lt(a, b)` | `result<boolean, error>` | Whether `a` is higher or lower than `b`. |
| `semver.gte(a, b)`, `semver.lte(a, b)` | `result<boolean, error>` | Whether `a` is higher or lower than, or equal to, `b`. |
| `semver.eq(a, b)`, `semver.neq(a, b)` | `result<boolean, error>` | Whether `a` and `b` have equal or different precedence. |
| `semver.satisfies(version: string, constraint: string)` | `result<boolean, error>` | Whether the version is in an npm-style range. Also fails with `ParseError` for a malformed range. |
| `semver.inc(version: string, part: string)` | `result<string, error>` | Increases `part` (`"major"`, `"minor"`, or `"patch"`) and clears the lower parts, prerelease, and build. Throws `ValueError` for any other part. |
| `semver.sort(versions: string[])` | `result<string[], error>` | A new array in ascending precedence. Equal versions keep their order. |
| `semver.max(versions: string[])` | `result<string, error>` | The highest version, as written. Fails with `ValueError` for an empty array. |
| `semver.min(versions: string[])` | `result<string, error>` | The lowest version, as written. Fails with `ValueError` for an empty array. |

`sort`, `max`, and `min` throw `TypeError` when `versions` is not an array of strings.

### Version records

`semver.parse` returns a `semver.Version` record:

| Key | Type | Meaning |
| --- | --- | --- |
| `major`, `minor`, `patch` | `int` | The numeric parts. |
| `prerelease` | `string?` | The text after `-`, such as `"rc.1"`, or `null`. |
| `build` | `string?` | The text after `+`, such as `"build.5"`, or `null`. |

### Ranges

`satisfies` understands:

- comparators: `">=1.2.0 <2"`
- caret and tilde ranges: `"^1.2"`, `"~1.2.3"`
- x-ranges: `"1.x"`
- hyphen ranges: `"1.2 - 1.5"`
- alternatives joined by `||`: `"^1.2 || 3.x"`

A prerelease version only matches comparators on the same `major.minor.patch`.

## Changes from earlier versions

Parsed versions no longer have a `valid` key. `semver.parse` fails with `ParseError` for text that isn't a version, so check untrusted text with `semver.isValid(text)`.

## Behavior and limits

- Parsing follows the SemVer rules for prerelease identifiers, build metadata, leading zeros, and ASCII identifier characters, so `"01.2.3"` and `"1.2"` are not versions.
- Comparisons ignore build metadata.
- The older `import "osl/semver"` spelling still works with a migration warning.
