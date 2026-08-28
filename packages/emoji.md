# `std:emoji`

`std:emoji` detects and edits emoji characters.

```osl
import "std:emoji"

log emoji.count("Hello 👋🌍")
log emoji.remove("Hello 👋")
```

## API

| Method | Returns | Behavior |
| --- | --- | --- |
| `emoji.isEmoji(value)` | `bool` |  |
| `emoji.onlyEmoji(value)` | `bool` |  |
| `emoji.count(value)` | `int` | Counts supported emoji characters. |
| `emoji.extract(value)` | `string[]` | Returns supported emoji characters in source order. |
| `emoji.remove(value)` | `string` | Removes supported emoji characters. |
| `emoji.replace(value, replacement)` | `string` | Replaces each supported emoji character. |
| `emoji.hasSkinTone(value)` | `bool` | Reports whether the value contains a skin-tone modifier. |
| `emoji.skinTone(value)` | `string` | Returns `light`, `medium-light`, `medium`, `medium-dark`, `dark`, or `none`. |
| `emoji.isZwjSequence(value)` | `bool` | Reports whether the value contains a zero-width joiner. |
| `emoji.isFlag(value)` | `bool` |  |
| `emoji.isValidReaction(value)` | `bool` | Accepts a supported emoji or an OriginChats reaction value. |

The package uses a fixed Unicode-range matcher. Combined sequences may be counted as multiple characters.
