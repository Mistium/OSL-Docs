---
description: Join, slice, search and reshape text, and build strings from values with templates.
lesson: 4
---

# Strings

Text in OSL is a `string`. Write one with double or single quotes; the two mean the same thing, so pick whichever saves you escaping a quote inside:

```osl
string a = "It's easy"
string b = 'She said "hi"'
string c = "Line one\nLine two"
log a
log b
log c
```

```output
It's easy
She said "hi"
Line one
Line two
```

A backslash escapes the next character: `\n` is a new line, `\t` a tab, `\"` a quote and `\\` a backslash.

## Joining text

`++` joins values into one string, and turns numbers and booleans into text on the way. `+` joins two strings too, but only when both sides are already strings, so `++` is the one to reach for:

```osl
string name = "Ada"
int age = 36
log name ++ " is " ++ age
log "a" + "b"
log "ab" * 3
```

```output
Ada is 36
ab
ababab
```

Multiplying a string by a whole number repeats it.

## Templates

A string in backticks is a template: `${...}` inside it runs the code and puts the result in the text. Templates are the clearest way to mix words and values:

```osl
string name = "Ada"
int[] scores = [90, 85, 77]
log `${name} scored ${scores.sum()} in total`
log `Average: ${round(scores.sum() / scores.len)}`
```

```output
Ada scored 252 in total
Average: 84
```

Any expression works inside `${...}`, including calls, maths and other strings. Write `\${` when you want the characters `${` themselves.

## Length and positions

`.len` is the number of characters. Positions start at 1, and negative positions count back from the end:

```osl
string word = "OSL rocks"
log word.len
log word[1]
log word[-1]
log word.left(3)
log word.right(5)
log word.trim(5, 7)
```

```output
9
O
s
OSL
rocks
roc
```

`left(n)` and `right(n)` take characters from either end, and `trim(from, to)` takes the characters between two positions, both included. Characters are whole Unicode characters, so `"héllo".len` is 5 and `"🙂"[1]` is the emoji.

## Searching

```osl
string sentence = "The quick brown fox"
log sentence.contains("quick")
log sentence.startsWith("The")
log sentence.endsWith("dog")
log sentence.index("brown")
log sentence.count("o")
```

```output
true
true
false
11
2
```

`index` gives the position where the text first appears, or `0` when it doesn't. Because positions start at 1, a `0` can never be mistaken for "found at the start".

> [!note] Comparing strings
> `==` compares text without caring about case, so `"Yes" == "yes"` is `true`, which is usually what you want when checking what someone typed. Use `===` when case matters.

## Changing text

Strings never change in place. Each method returns a new string:

```osl
string raw = "  Hello, World  "
log raw.trim()
log raw.trim().toUpper()
log raw.trim().toLower()
log raw.trim().replace("World", "OSL")
log "a-b-c".replace("-", "+")
log "a-b-c".replaceFirst("-", "+")
log "7".padStart("0", 3)
```

```output
Hello, World
HELLO, WORLD
hello, world
Hello, OSL
a+b+c
a+b-c
007
```

`replace` changes every match, and `replaceFirst` only the first. `padStart(padding, length)` pads the front until the text is that long.

## Splitting and joining

`split` breaks a string into an array, and an array's `join` puts it back together:

```osl
string csv = "red,green,blue"
string[] colours = csv.split(",")
log colours
log colours.len
log colours.join(" / ")
log "one two  three".split(" ")
```

```output
["red","green","blue"]
3
red / green / blue
["one","two","","three"]
```

Arrays print as JSON, which is why `colours` shows with brackets and quotes. Notice the empty string where two spaces were next to each other.

## Going through each character

A `for ... in` loop walks a string one character at a time:

```osl
int vowels = 0
for ch in "programming" (
  if "aeiou".contains(ch) (
    vowels++
  )
)
log vowels
```

```output
3
```

## Multi-line text

A template can span several lines, which is handy for messages and small files:

```osl
string name = "Ada"
string letter = `Dear ${name},

Thanks for trying OSL.`
log letter
```

```output
Dear Ada,

Thanks for trying OSL.
```

:::quiz
What does `log "abc".index("z")` print?

- [ ] `-1`
- [x] `0`
- [ ] `null`

Positions start at 1, so 0 is free to mean "not found".
:::

:::quiz
Which line prints `Score: 10`?

- [x] ``log `Score: ${5 * 2}` ``
- [ ] `log "Score: ${5 * 2}"`
- [ ] `log 'Score: ' + 10`

Only backtick strings are templates. Quoted strings keep `${...}` as plain text, and `+` only joins two strings.
:::

:::exercise title="Initials"
Print the initials of the full name, in capitals, with a dot after each.

```osl
string fullName = "grace brewster hopper"

log fullName
```

```output
G.B.H.
```

> [!hint]
> `split(" ")` gives you the three names. A loop can take the first character of each with `[1]`.

> [!hint]
> Build the result with `++=` inside the loop, then call `.toUpper()` on it.

```osl solution
string fullName = "grace brewster hopper"

string initials = ""
for part in fullName.split(" ") (
  initials ++= part[1] ++ "."
)
log initials.toUpper()
```
:::
