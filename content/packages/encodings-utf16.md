---
description: Measure, index, order and case-map strings the way JavaScript does, in UTF-16 code units with 1-based positions.
package: encodings/utf16
---

# encodings/utf16

OSL strings count characters: `"😀".len` is `1`. JavaScript, Java, C# and the Windows API count UTF-16 code units, where that emoji takes two. When you port code from those languages or must match offsets and orderings produced by them, this package gives you the same answers.

Use it when you read positions from JavaScript (an editor, a language server, a browser), must match JavaScript's `<`, or need its exact casing. Otherwise the built-in string methods are the right tool.

```osl fragment
import "std:encodings/utf16"
```

The import name is `utf16`.

## Length in code units

Characters in the basic plane take one code unit. Characters outside it, such as emoji, take two (a surrogate pair).

```osl
import "std:encodings/utf16"

string s = "a😀b"
log s.len
log utf16.length(s)
log utf16.length("") utf16.length("héllo")
```

```output
3
4
0 5
```

Try it: measure `"héllo"` and `"日本語"`. Which are one unit per character?

## Positions

Positions are counted in code units and start at 1, like the rest of OSL. `index` finds where a part first occurs and returns `0` when it doesn't. `at` returns the code unit at a position, and `trim` returns the code units from one position to another, both ends included.

```osl
import "std:encodings/utf16"

string s = "a😀b"
log utf16.index(s, "b") utf16.index(s, "z")
log utf16.at(s, 1) utf16.at(s, 4)
log utf16.trim(s, 2, 3)
log utf16.trim(s, 1, 1)
```

```output
4 0
a b
😀
a
```

`"b"` is at position 4, not 3, because the emoji before it takes two units. A position that falls in the middle of a pair gives half a character:

```osl
import "std:encodings/utf16"

string half = utf16.at("😀", 1)
log utf16.length(half)
log utf16.join(half, utf16.at("😀", 2)) == "😀"
```

```output
1
true
```

`join` glues strings together like JavaScript's `+`, so two halves of a pair become the whole character again.

## Ordering

`compare(a, b)` returns `-1`, `0` or `1` by comparing code units, as JavaScript's `<` does. This differs from OSL's own ordering for characters beyond the basic plane: a high surrogate (the first half of an emoji) sorts before characters in the range U+E000 to U+FFFF.

```osl
import "std:encodings/utf16"

log utf16.compare("apple", "banana") utf16.compare("b", "a") utf16.compare("a", "a")

string wide = "\u{FF5E}"
string emoji = "\u{1F600}"
log "OSL:" (wide < emoji)
log "UTF-16:" utf16.compare(wide, emoji)
```

```output
-1 1 0
OSL: true
UTF-16: 1
```

## Case

`upper` and `lower` apply full Unicode case mapping, like `toUpperCase` and `toLowerCase`. Note that `ß` becomes `SS`, which changes the length.

```osl
import "std:encodings/utf16"

log utf16.upper("straße") utf16.lower("ÀLVARO")
log utf16.length("straße") utf16.length(utf16.upper("straße"))
```

```output
STRASSE àlvaro
6 7
```

## Case-insensitive checks

Three helpers compare as if both sides were lower-cased: `compareLower`, `containsLower` and `isSameLower`. 

```osl
import "std:encodings/utf16"

log utf16.containsLower("Hello World", "WORLD")
log utf16.compareLower("Apple", "banana")
log utf16.isSameLower("HeLLo", "hello")
```

```output
true
-1
true
```

`isSameLower(text, lowered)` expects the second argument to be lower-case already, so you can lower-case a search term once and test many strings against it.

:::quiz
What is `utf16.length("😀")`?

- [ ] 1
- [x] 2
- [ ] 4

The emoji is outside the basic plane, so it takes two UTF-16 code units. OSL's own `.len` says 1.
:::

:::exercise title="Port a JavaScript offset"
An editor reports position 4 in `"😀 hi"`. Print the letter there, then the OSL length and the UTF-16 length.

```osl
import "std:encodings/utf16"

string text = "😀 hi"
log text.len
```

```output
h
4 5
```

> [!hint]
> `utf16.at(text, 4)`

> [!hint]
> `utf16.length(text)`

```osl solution
import "std:encodings/utf16"

string text = "😀 hi"
log utf16.at(text, 4)
log text.len utf16.length(text)
```

```output
h
4 5
```
:::

## API reference

::api
