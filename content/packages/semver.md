---
description: Parse, compare, sort, bump and range-match semantic versions such as 1.4.0-rc.1.
package: semver
---

# semver

A semantic version has three numbers and, optionally, extras: `1.4.2`, `2.0.0-rc.1`, `1.0.0+build.5`. The numbers are major, minor and patch. `std:semver` understands them, so you can compare versions the way a human would, where `1.10.0` is newer than `1.2.0` (compare them as text and you get the wrong answer).

Use it for update checks, plugin compatibility, release tooling, and anything that reads a version from a file or an API.

Most functions return a [result](result.md), because a string may not be a version at all.

## Checking and parsing

`isValid` says whether text is a version. `parse` takes it apart:

```osl
import "std:semver"

log semver.isValid("1.4.0-rc.1")
log semver.isValid("1.2")
log semver.isValid("v2.0.1")

auto v = semver.parse("1.4.0-rc.1+build.5").unwrap()
log v.major v.minor v.patch
log v.prerelease
log v.build
```

```output
true
false
true
1 4 0
rc.1
build.5
```

Three numbers are required, so `1.2` is not valid. A leading `v` is accepted and ignored. `prerelease` and `build` are `null` when a version has none.

A bad string is a `ParseError`:

```osl
import "std:semver"

auto bad = semver.parse("latest")
log bad.isErr()
log bad.unwrapErr().kind
```

```output
true
ParseError
```

## Comparing

Never compare versions as text. `compare` returns -1, 0 or 1, and `gt`, `gte`, `lt`, `lte`, `eq` and `neq` return booleans:

```osl
import "std:semver"

log "1.10.0" > "1.2.0"
log semver.gt("1.10.0", "1.2.0").unwrap()
log semver.compare("1.2.3", "1.10.0").unwrap()
log semver.lt("1.0.0-alpha", "1.0.0").unwrap()
log semver.eq("1.0.0+a", "1.0.0+b").unwrap()
```

```output
false
true
-1
true
true
```

Two rules are worth knowing. A pre-release is lower than its release (`1.0.0-alpha` comes before `1.0.0`). Build metadata after the `+` is ignored, so the last two versions are equal.

## Update checks

A real use: tell the user whether an update is available. The `unwrapOr` keeps one bad value from stopping the program:

```osl
import "std:semver"

def updateMessage(string current, string latest) string (
  if semver.gt(latest, current).unwrapOr(false) (
    return "update available: " ++ current ++ " to " ++ latest
  )
  return "up to date"
)

log updateMessage("1.9.0", "1.10.0")
log updateMessage("2.0.0", "2.0.0")
log updateMessage("2.0.0", "oops")
```

```output
update available: 1.9.0 to 1.10.0
up to date
up to date
```

## Bumping

`inc(version, part)` raises `"major"`, `"minor"` or `"patch"` and resets the parts after it:

```osl
import "std:semver"

log semver.inc("1.4.2", "patch").unwrap()
log semver.inc("1.4.2", "minor").unwrap()
log semver.inc("1.4.2", "major").unwrap()
```

```output
1.4.3
1.5.0
2.0.0
```

## Sorting and picking

`sort` puts a list in ascending order, and `max` and `min` return the highest and lowest. They return the strings as you wrote them:

```osl
import "std:semver"

string[] tags = ["1.10.0", "1.2.0", "1.2.0-beta", "0.9.9"]
log semver.sort(tags).unwrap()
log semver.max(tags).unwrap()
log semver.min(tags).unwrap()
```

```output
["0.9.9","1.2.0-beta","1.2.0","1.10.0"]
1.10.0
0.9.9
```

One invalid entry makes the whole call fail with a `ParseError`, so filter first with `tags.filter(t -> semver.isValid(t))` when the list comes from outside.

## Ranges

`satisfies(version, range)` is how dependencies say what they accept. It uses npm-style ranges:

| Range | Accepts |
| --- | --- |
| `^1.2.0` | `1.2.0` up to, but not including, `2.0.0` |
| `~1.4.0` | `1.4.0` up to, but not including, `1.5.0` |
| `>=1.2.0 <1.5.0` | both comparisons must hold |
| `1.2.x` | any patch of 1.2 |
| `1.2.x \|\| 1.3.x` | either side |

```osl
import "std:semver"

log semver.satisfies("1.4.2", "^1.2.0").unwrap()
log semver.satisfies("2.0.0", "^1.2.0").unwrap()
log semver.satisfies("1.4.9", "~1.4.0").unwrap()
log semver.satisfies("1.5.0", ">=1.2.0 <1.5.0").unwrap()
log semver.satisfies("1.3.0", "1.2.x || 1.3.x").unwrap()
```

```output
true
false
true
false
true
```

Ranges compare by version order, so a pre-release counts as lower than its release: `semver.satisfies("1.0.0-beta", "^1.0.0")` is `false`. Unlike npm, `satisfies` doesn't exclude pre-releases of later versions, so `1.9.0-beta` does satisfy `^1.0.0`. Filter pre-releases out yourself (`v.prerelease == null` after `semver.parse`) if stable-only matters.

Combined, these make a compatibility check:

```osl
import "std:semver"

object plugins = {
  charts: "1.3.0",
  export: "2.0.1",
  themes: "1.9.4"
}
string need = "^1.2.0"

for name in plugins.getKeys().toSorted() (
  string version = plugins[name]
  string verdict = "incompatible"
  if semver.satisfies(version, need).unwrapOr(false) ( verdict = "ok" )
  log name version verdict
)
```

```output
charts 1.3.0 ok
export 2.0.1 incompatible
themes 1.9.4 ok
```

:::quiz
What does `semver.satisfies("1.5.0", "~1.4.0")` give?

- [ ] `true`, because 1.5.0 is newer
- [x] `false`, because `~1.4.0` stops before 1.5.0
- [ ] A `ParseError`

`~1.4.0` accepts patch releases of 1.4 only. `^1.4.0` would accept 1.5.0.
:::

:::exercise title="Newest compatible version"
Print the newest version in `tags` that satisfies `^1.0.0`. Right now it prints the newest of all, which is `2.0.0`.

```osl
import "std:semver"

string[] tags = ["0.9.0", "1.2.0", "1.8.2", "2.0.0"]
log semver.max(tags).unwrap()
```

```output
1.8.2
```

> [!hint]
> Filter first: `tags.filter(t -> semver.satisfies(t, "^1.0.0").unwrapOr(false))`.

```osl solution
import "std:semver"

string[] tags = ["0.9.0", "1.2.0", "1.8.2", "2.0.0"]
auto compatible = tags.filter(t -> semver.satisfies(t, "^1.0.0").unwrapOr(false))
log semver.max(compatible).unwrap()
```
:::

## API reference

::api
