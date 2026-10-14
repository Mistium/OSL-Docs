# emoji

Use `emoji` to find, count, extract, replace, and remove emoji in text. A flag, keycap, skin-toned emoji, or ZWJ sequence (such as a family) counts as one emoji.

```osl
import "std:emoji"
```

## Example

```osl
import "std:emoji"

log emoji.count("Hello 👋🌍 👨‍👩‍👧")  // 3
log emoji.extract("a👍🏽b1️⃣")        // ["👍🏽","1️⃣"]
log emoji.remove("Hello 👋")         // Hello
log emoji.hasEmoji("plain text")     // false

string tone = emoji.skinTone("👍🏽") ?? "none"
log tone                             // medium
```

## API reference

### `emoji`

| Function | Returns | Notes |
| --- | --- | --- |
| `emoji.hasEmoji(text: string)` | `boolean` | Whether the text contains at least one emoji. |
| `emoji.isOnlyEmoji(text: string)` | `boolean` | Whether the text is one or more emoji with nothing else, not even spaces. `""` is not. |
| `emoji.count(text: string)` | `int` | How many emoji the text contains. |
| `emoji.extract(text: string)` | `string[]` | Every emoji in order. `[]` when there are none. |
| `emoji.remove(text: string)` | `string` | The text with every emoji removed. |
| `emoji.replace(text: string, replacement: string)` | `string` | The text with each emoji replaced. `replacement` is literal, so `$1` is not expanded. |
| `emoji.hasSkinTone(text: string)` | `boolean` | Whether the text contains a skin-tone modifier. |
| `emoji.skinTone(text: string)` | `string?` | The first skin tone: `"light"`, `"medium-light"`, `"medium"`, `"medium-dark"`, or `"dark"`, or `null` when there is none. |
| `emoji.isZWJSequence(text: string)` | `boolean` | Whether the text contains a zero-width joiner (U+200D), which joins emoji such as a family into one. |
| `emoji.isFlag(text: string)` | `boolean` | Whether the text is exactly one flag: a pair of regional indicators or a tag-sequence flag such as England's. |
| `emoji.isValidReaction(text: string)` | `boolean` | Whether the text is exactly one emoji, or an OriginChats custom reaction `"originChats:<emoji>//"` wrapping one. |

OSL matches function names without regard to case, so `emoji.isZwjSequence` also reaches `isZWJSequence`.

## Changes from earlier versions

`emoji.isEmoji` and `emoji.onlyEmoji` are now `emoji.hasEmoji` and `emoji.isOnlyEmoji`. `emoji.skinTone` now returns `null` rather than `"none"` when the text has no skin tone.
