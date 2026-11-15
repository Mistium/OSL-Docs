---
description: Every built-in property and method of string, grouped by what it does, with the position and case rules that trip people up.
---

# Strings

Methods return new strings and never change the original. Positions count from 1, by character. Lesson: [Strings](../learn/strings.md).

```osl
string s = "  Hello, World  "
log s.trim().toUpper() s.trim().len
log s.trim().replace("World", "OSL")
log s.trim().split(", ")
```

```output
HELLO, WORLD 12
Hello, OSL
["Hello","World"]
```

## Properties and indexing

| Form | Gives |
| --- | --- |
| `s.len` | number of characters (a property, no brackets) |
| `s[n]` | the character at position `n` (1 is the first, -1 the last) |
| `s[a:b]` | the characters from `a` to `b`, both included; leave either out for the start or the end |
| `s.runeCount()` | the same count as `.len`, as a method |
| `s.toBytes().len` | the size in UTF-8 bytes |

```osl
string s = "héllo, world"
log s.len s.toBytes().len
log s[1] s[-1] s[2]
log s[1:5] s[:3] s[8:]
```

```output
12 13
h d é
héllo hél world
```

Position 0 is an error, and a slice that starts past the end is empty.

```osl error
log "abc"[0]
```

## Joining and repeating

| Form | Gives |
| --- | --- |
| `a ++ b` | the two joined, with `b` turned into text if it isn't already |
| `a + b` | the two joined, when both are strings |
| `s * n` | `s` repeated `n` times |
| `s.append(x, ...)` | `s` with each `x` added to the end |
| `s.prepend(x, ...)` | `s` with each `x` added to the start |
| `s.concat(x)` | `s` with `x` added to the end |
| `` `text ${expr}` `` | a template: each `${}` is replaced by its value as text |

```osl
string a = "ab"
log a ++ 1 ++ true
log a * 3
log a.append("c", "d") a.prepend(">")
log `${a} has ${a.len} characters`
```

```output
ab1true
ababab
abcd >ab
ab has 2 characters
```

## Case and whitespace

| Method | Gives |
| --- | --- |
| `toUpper()` | all upper case |
| `toLower()` | all lower case |
| `toTitle()` | the first letter of each word in upper case |
| `toMixed()` | alternating case, starting with upper: `hello` becomes `HeLlO` |
| `trim()` or `strip()` | without whitespace at both ends |
| `trimStart()` | without whitespace at the start |
| `trimEnd()` | without whitespace at the end |
| `stripStart(text)` | without `text` at the start, once, if it is there |
| `stripEnd(text)` | without `text` at the end, once, if it is there |

```osl
string s = "  hello world  "
log "[" ++ s.trim() ++ "]"
log "[" ++ s.trimStart() ++ "]" "[" ++ s.trimEnd() ++ "]"
log s.trim().toUpper() s.trim().toTitle() s.trim().toMixed()
log "xxabcxx".stripStart("x") "xxabcxx".stripEnd("x")
log "v1.2.3".stripStart("v")
```

```output
[hello world]
[hello world  ] [  hello world]
HELLO WORLD Hello World HeLlO WoRlD
xabcxx xxabcx
1.2.3
```

`trimStart()` and `trimEnd()` take no argument. To remove given text use `stripStart(text)` and `stripEnd(text)`.

## Searching

| Method | Gives |
| --- | --- |
| `contains(text)` | `true` if `text` appears (case matters) |
| `containsAny(a, b, ...)` | `true` if any of the texts appears |
| `startsWith(text)` | `true` if the string starts with `text` |
| `endsWith(text)` | `true` if the string ends with `text` |
| `index(text)` | position of the first match, or `0` |
| `lastIndex(text)` | position of the last match, or `0` |
| `count(text)` | how many times `text` appears |
| `isEmpty()` | `true` for `""` |
| `x in s` | `true` if `x` appears in `s` (the operator form of `contains`) |

Searching is case-sensitive, even though `==` between strings is not.

```osl
string s = "Hello, hello"
log s.contains("ello") s.contains("ELLO") "ello" in s
log s.containsAny("xyz", "H")
log s.startsWith("He") s.endsWith("lo")
log s.index("l") s.lastIndex("l") s.index("z")
log s.count("l") s.count("ello")
log "".isEmpty() s.isEmpty()
log "Hello" == "hELLO" "Hello" === "hELLO"
```

```output
true false true
true
true true
3 11 0
4 2
true false
true false
```

## Cutting and replacing

| Method | Gives |
| --- | --- |
| `left(n)` | the first `n` characters |
| `right(n)` | the last `n` characters |
| `trim(a, b)` | the characters from position `a` to `b`, both included; negative positions count from the end |
| `insert(n, text)` | `text` put in before position `n`; past the end it is added at the end |
| `replace(old, new)` | every `old` replaced by `new` (case matters) |
| `replaceFirst(old, new)` | the first `old` replaced by `new` |
| `reverse()` | the characters in reverse order |
| `trimText(max)` | shortened to `max` characters, ending in `..` if it was cut |
| `trimText(max, ending)` | the same, with your own ending |

```osl
string s = "hello world"
log s.left(5) s.right(5)
log s.trim(1, 5) s.trim(-5, -1)
log s.insert(6, ",") s.insert(99, "!")
log s.replace("o", "0") s.replaceFirst("o", "0")
log s.reverse()
log s.trimText(8) s.trimText(8, "~") s.trimText(20)
```

```output
hello world
hello world
hello, world hello world!
hell0 w0rld hell0 world
dlrow olleh
hello .. hello w~ hello world
```

## Splitting

| Method | Gives |
| --- | --- |
| `split(sep)` | an array of the parts between each `sep`; `""` splits into characters |
| `split(sep, n)` | at most `n` parts, the last one holding the rest |
| `lines()` | an array of the lines |
| `words()` | an array of the words, split on any whitespace |
| `toArr()` | an array of the characters |

```osl
log "a,b,c".split(",")
log "a,b,c".split(",", 2)
log "abc".split("")
log "one\ntwo\r\nthree".lines()
log "  many   spaces here ".words()
log "héy".toArr()
```

```output
["a","b","c"]
["a","b,c"]
["a","b","c"]
["one","two","three"]
["many","spaces","here"]
["h","é","y"]
```

## Padding

| Method | Gives |
| --- | --- |
| `padStart(pad, length)` | padded at the start with `pad` up to `length` characters |
| `padEnd(pad, length)` | padded at the end with `pad` up to `length` characters |

The padding comes first and the length second. A string that is already long enough is returned as it is.

```osl
log "7".padStart("0", 3)
log "ab".padEnd(".", 6) ++ "|"
log "toolong".padStart("0", 3)
```

```output
007
ab....|
toolong
```

## Regular expressions

A regular expression is written `` $`pattern` `` and ends with flags such as `i` for case-insensitive. Backslashes are taken as they are, so `` $`\d+` `` needs no doubling. A string pattern also works with `match`, `replace` and `split`.

| Form | Gives |
| --- | --- |
| `s.match("pattern")` | an array of every match, empty if none |
| `s.match($`pattern`)` | `true` if the pattern matches anywhere |
| `s.findAll($`pattern`)` | an array of every match |
| `s.replace($`pattern`, new)` | every match replaced |
| `s.split($`pattern`)` | the parts between matches |
| `re.test(s)` | `true` if `re` matches anywhere in `s` |
| `re.find(s)` | the first match, or `""` |
| `re.findAll(s)` | an array of every match |
| `re.count(s)` | the number of matches |
| `re.replace(s, new)` | every match replaced |
| `re.split(s)` | the parts between matches |
| `re.source()` | the pattern text |

```osl
string s = "a1b22c333"
log s.match("[0-9]+")
log s.match($`[0-9]+`) s.match($`[xyz]+`)
log s.findAll($`[0-9]+`)
log s.replace($`[0-9]+`, "#")
log "one  two   three".split($`\s+`)
auto word = $`ab+`i
log word.test("xABBx") word.find("xABBx") word.count("ab abb")
```

```output
["1","22","333"]
true false
["1","22","333"]
a#b#c#
["one","two","three"]
true ABB 2
```

## Text encodings and hashes

| Method | Gives |
| --- | --- |
| `btoa()` | the string as Base64 |
| `atob()` | the Base64 text decoded, or `""` if it is not valid |
| `encodeHex()` | each byte as two hex digits |
| `decodeHex()` | a `result` holding the decoded text |
| `encodeBin()` | each byte as binary digits, separated by spaces |
| `decodeBin()` | a `result` holding the decoded text |
| `hashMD5()`, `hashSHA1()`, `hashSHA256()`, `hashSHA512()` | the hash as hex text |
| `ord()` | the code of the first character |
| `toBytes()` | the UTF-8 bytes as a `byte[]` |

For URL escaping use `encodeURIComponent` and `decodeURIComponent`, listed with the [built-in functions](builtins.md).

```osl
log "hi".btoa() "aGk=".atob()
log "hi".encodeHex() "6869".decodeHex().unwrap()
log "hi".encodeBin() "1101000 1101001".decodeBin().unwrap()
log "hi".hashMD5()
log "hi".hashSHA256()
log "A".ord() "é".ord()
log "hi".toBytes().len
```

```output
aGk= hi
6869 hi
1101000 1101001 hi
49f68a5c8493ec2c0bf489821c21fc3b
8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
65 233
2
```

## Converting

Every value has the conversion methods listed in [Types](types.md). The ones used on strings most:

| Method | Gives |
| --- | --- |
| `toInt()` | the whole number the text holds, or `0` |
| `toNum()` | the number the text holds, or `0` |
| `toBool()` | `true` only for the text `"true"` |
| `tryAs<int>` | a `result`, so bad text is an error rather than `0` |

```osl
log "42".toInt() "3.5".toNum() "x".toInt()
log "true".toBool() "yes".toBool()
log "42".tryAs<int>.unwrap() "x".tryAs<int>.isErr()
```

```output
42 3.5 0
true false
42 true
```

> [!note] No repeat method
> There is no `repeat` method. Multiply: `"ab" * 3`.
