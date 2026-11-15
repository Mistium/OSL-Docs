---
description: Find, count, extract and strip emoji in text, with flags, skin tones and joined sequences each counted as one.
package: emoji
---

# emoji

Emoji are trickier than they look. A flag is two code points, a thumbs up with a skin tone is two, and a family is seven (three people joined by invisible joiners). Counting them with `.len` or splitting a string by character gets this wrong. `std:emoji` knows the rules: each of those is one emoji.

Reach for it to count reactions, validate that a field holds exactly one emoji, clean text for a system that can't show them, or pull emoji out of a message.

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

Compare that with the length of the text, which counts every code point that went into the two emoji:

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

Removing leaves the spaces around the emoji, so tidy up afterwards with `.trim()` or [`regex.stripWhitespace`](regex.md).

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

## API reference

::api
