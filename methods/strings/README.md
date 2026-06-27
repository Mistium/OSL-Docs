# String Methods

Methods you can call on any `string` value with a dot. They never mutate the original string — each
returns a new value. String positions are **1-indexed**, matching arrays.

```javascript
string name = "Ada Lovelace"
log name.toUpper()    // "ADA LOVELACE"
log name.split(" ")   // ["Ada", "Lovelace"]
```

## In this section

- **[Case & Whitespace](case.md)** — `toUpper`, `toLower`, `toTitle`, `trim`, `strip`.
- **[Searching & Testing](search.md)** — `contains`, `containsAny`, `startsWith`, `endsWith`,
  `index`, `lastIndex`, `count`.
- **[Slicing & Splitting](slicing.md)** — `left`, `right`, `split`, `toArr`.
- **[Building & Editing](editing.md)** — `append`, `prepend`, `insert`, `replace`, `replaceFirst`,
  `stripStart`, `stripEnd`, `padStart`, `padEnd`.
- **[Encoding, Hashing & Input](encoding.md)** — `ord`, `btoa`/`atob`, `encodeHex`/`decodeHex`,
  `encodeBin`/`decodeBin`, `hashMD5`/`hashSHA1`/`hashSHA256`/`hashSHA512`, `ask`.

## Regex methods

When you pass a [`regex`](../../packages/regex.md) value, strings gain regex-aware behaviour:

| Method | Result | Description |
| --- | --- | --- |
| `.match(re)` | `boolean` | Whether the regex matches anywhere. |
| `.findAll(re)` | `array` | All matches. |
| `.replace(re, new)` | `string` | Replace every regex match. |
| `.split(re)` | `array` | Split on the regex. |

`.match(pattern)` with a plain string pattern returns an `array` of matches. See the
[`regex`](../../packages/regex.md) package for building patterns.

## Universal methods

Strings also support the methods shared by all values — `.len` (a property), `.toNum()`, `.toInt()`,
`.toBool()`, `.toStr()`, `.getType()`, `.clone()`, `.item(i)`. See
[Type & conversion methods](../types/README.md).
