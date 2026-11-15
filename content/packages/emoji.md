---
description: Find, count, extract and strip emoji in text, with flags, skin tones and joined sequences each counted as one.
package: emoji
---

# emoji

Emoji are trickier than they look. A flag is two code points, a thumbs up with a skin tone is two, and a family is five (three people joined by two invisible joiners). Counting them with `.len` or splitting a string by character gets this wrong. `std:emoji` knows the rules: each of those is one emoji.

## Detecting and counting

```osl
import "std:emoji"

string message = "Great work 👍🏽 see you in 🇬🇧"
log emoji.hasEmoji(message)
log emoji.hasEmoji("no emoji here")
log emoji.count(message)
```

```output
true
false
2
```

The text's `.len` counts every code point that went into the emoji:

```osl
import "std:emoji"

string family = "👨‍👩‍👧"
log emoji.count(family)
log family.len
```

```output
1
5
```

## Extracting

`extract` returns each emoji in order, whole:

```osl
import "std:emoji"

string post = "Hi 👋🏽 from 🇬🇧 and 👨‍👩‍👧, keycap 1️⃣ and 🙂"
log emoji.extract(post)
log emoji.extract("none")
```

```output
["👋🏽","🇬🇧","👨‍👩‍👧","1️⃣","🙂"]
[]
```

Counting how often each one appears is then a few lines of [map](map.md):

```osl
import "std:emoji"

string chat = "👍 👍 🎉 👍 🎉 😀"
string[int] tally = {}
for e in emoji.extract(chat) (
  tally[e] = (tally[e] ?? 0) + 1
)
for e in tally.getKeys().toSorted() (
  log e tally[e]
)
```

```output
🎉 2
👍 3
😀 1
```

## Removing and replacing

`remove` deletes every emoji. `replace` swaps each one for text:

```osl
import "std:emoji"

string text = "Launch day 🚀 !"
log emoji.remove(text)
log emoji.replace(text, "[emoji]")
log emoji.replace("a🙂b🙃c", "")
```

```output
Launch day  !
Launch day [emoji] !
abc
```

Removing leaves the spaces around the emoji, so tidy up afterwards with `.trim()`.

## Asking what a string is

```osl
import "std:emoji"

log emoji.isFlag("🇬🇧") emoji.isFlag("🙂")
log emoji.isOnlyEmoji("🙂🙂") emoji.isOnlyEmoji("a🙂")
log emoji.isZWJSequence("👨‍👩‍👧") emoji.isZWJSequence("🙂")
```

```output
true false
true false
true false
```

A ZWJ sequence is several emoji joined by a zero-width joiner into one picture, such as a family or a profession.

## Skin tones

`hasSkinTone` tells whether a skin-tone modifier is present, and `findSkinTone` names the first one: `"light"`, `"medium-light"`, `"medium"`, `"medium-dark"` or `"dark"`, or `null` when there is none:

```osl
import "std:emoji"

log emoji.hasSkinTone("👋🏽")
log emoji.findSkinTone("👋🏽")
log emoji.findSkinTone("👋") ?? "none"
```

```output
true
medium
none
```

## Validating a reaction

A reaction field should hold exactly one emoji and nothing else. `isValidReaction` checks that:

```osl
import "std:emoji"

string[] tries = ["👍", "👍👍", "a", "🇬🇧", "👨‍👩‍👧"]
for t in tries (
  log t emoji.isValidReaction(t)
)
```

```output
👍 true
👍👍 false
a false
🇬🇧 true
👨‍👩‍👧 true
```

:::quiz
What does `emoji.count("🇬🇧")` return?

- [ ] `2`, because a flag is two code points.
- [x] `1`, because the flag is a single emoji.
- [ ] `0`, because flags aren't emoji.

`std:emoji` counts what a reader sees. `"🇬🇧".len` would be 2.
:::

:::exercise title="Clean a status"
Finish `clean` so it removes every emoji from a status and trims the spaces they leave behind.

```osl
import "std:emoji"

def clean(string text) string -> text

log clean("Launch 🚀")
log clean("🎉 Party 🎉")
log clean("plain")
```

```output
Launch
Party
plain
```

> [!hint]
> `emoji.remove(text)` deletes the emoji but leaves the spaces.

> [!hint]
> Chain `.trim()` onto the result.

```osl solution
import "std:emoji"

def clean(string text) string -> emoji.remove(text).trim()

log clean("Launch 🚀")
log clean("🎉 Party 🎉")
log clean("plain")
```
:::

## API reference

::api
