# utf16

Use `utf16` to measure, index, order, and case-map strings the way JavaScript does, counting UTF-16 code units. It is useful when you exchange string lengths or positions with JavaScript code, or need JavaScript's sort order. Positions are 1-based, like the rest of OSL.

```osl
import "std:utf16"
```

## Example

```osl
import "std:utf16"

string text = "hi 😀!"
log utf16.length(text)         // 6: the emoji is two code units, as in JavaScript
log utf16.trim(text, 4, 5)     // 😀
log utf16.trim(text, -1, -1)   // !

int pos = utf16.index(text, "!") ?? 0
log pos                        // 6
log utf16.index(text, "?")     // null

log utf16.upper("straße")      // STRASSE
log utf16.isSameLower("HeLLo", "hello") // true
```

## API reference

### `utf16`

| Function | Returns | Notes |
| --- | --- | --- |
| `utf16.length(text: string)` | `int` | The length in UTF-16 code units, which is JavaScript's `string.length`. A character outside the Basic Multilingual Plane, such as most emoji, counts as 2. |
| `utf16.at(text: string, index: int)` | `string?` | The code unit at a 1-based index, as a string. Half of a surrogate pair comes back as a lone surrogate. `null` when the index is outside the string. |
| `utf16.trim(text: string, start: int, end: int)` | `string` | The code units from `start` to `end`, both 1-based and inclusive. A negative position counts back from the end (`-1` is the last code unit). Positions past either end are clamped and reversed positions are swapped, so `trim` never fails. |
| `utf16.index(text: string, part: string)` | `int?` | The 1-based code unit position where `part` first occurs, or `null`. An empty `part` is found at `1`. |
| `utf16.compare(a: string, b: string)` | `int` | Orders by UTF-16 code units, as JavaScript's `<` does: `-1` when `a` sorts first, `0` when equal, `1` when `b` sorts first. |
| `utf16.lower(text: string)` | `string` | JavaScript's `toLowerCase`, with full Unicode case mapping (final sigma included). |
| `utf16.upper(text: string)` | `string` | JavaScript's `toUpperCase`, with full Unicode case mapping (`"ß"` becomes `"SS"`). |
| `utf16.isSameLower(text: string, lowered: string)` | `boolean` | Whether `utf16.lower(text)` equals `lowered`, without building the lowered copy for ASCII text. |
| `utf16.join(a: string, b: string)` | `string` | Concatenates like JavaScript's `+`: a lone high surrogate at the end of `a` and a lone low surrogate at the start of `b` become one character again. |

## Lone surrogates

OSL strings stay UTF-8. A lone surrogate, which JavaScript strings can hold, is kept in its 3-byte WTF-8 form so it survives round trips through `at`, `trim`, `join`, `lower`, and `upper`.

```osl
import "std:utf16"

string face = "😀"
string high = utf16.at(face, 1) ?? ""
string low = utf16.at(face, 2) ?? ""
log utf16.join(high, low) == face // true
log utf16.at(face, 3)             // null
```

## Changes from earlier versions

`utf16.slice` and `utf16.indexOf`, which were 0-based like JavaScript, are now the 1-based `utf16.trim` and `utf16.index`. `utf16.sameLower` is now `utf16.isSameLower`. `utf16.at` returns `null` rather than `""` outside the string.
