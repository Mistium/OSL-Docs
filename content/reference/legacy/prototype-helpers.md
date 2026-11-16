---
description: The helper methods originOS added to strings, numbers, arrays and objects, which no longer exist, and the modern way to do each job.
---

# Legacy prototype helpers

The originOS runtime added methods to its values: `.JsonParse()` on a string, `.padStart()` on a number, `.confirm()` on text that opened a dialog. They were called prototype helpers, because the runtime attached them to each type's prototype. The compiler has none of them under those names. Calling one is a compile error:

```osl error
log 42.append("px")
```

Each job has a modern way to do it, shown here. The legacy names are written the way the old documentation spelled them.

## JSON

The four JSON helpers are now functions in [`std:json`](../../packages/json.md), which return a `result` for the operations that can fail.

| Legacy | Today |
| --- | --- |
| `text.JsonParse()` | `json.parse(text)` |
| `value.JsonStringify()` | `json.stringify(value)` |
| `value.JsonFormat()` | `json.stringify(value, {indent: 2})` |
| `value.JsonClean()` | No equivalent. `json.parse` is strict, and `json.isValid(text)` tests text first. |
| `object.JsonParse()` | Not needed. An object is already parsed. |

```legacy
arr = "[\"wow\"]"
log arr.JsonParse()           // returns array ["wow"]

arr = ["wow","crazy"]
log arr.JsonFormat()          // formatted over several lines
log arr.JsonStringify()       // returns the string ["wow","crazy"]
```

```osl
import "std:json"

string[] words = ["wow", "crazy"]
log json.stringify(words)
log json.stringify(words, {indent: 2})

string[] parsed = json.parse<string[]>("[\"wow\"]").unwrap()
log parsed
```

```output
["wow","crazy"]
[
  "wow",
  "crazy"
]
["wow"]
```

Naming the type, as in `json.parse<string[]>`, checks the shape of the data as it is read. See [Errors](../../learn/errors.md) for what to do when parsing fails.

## Strings

| Legacy | Today |
| --- | --- |
| `.confirm(prompt)` | `tui.confirm(prompt)` from [`std:tui`](../../packages/tui.md), which returns a result. |
| `.delete(index)` | Join the two parts: `text.left(3) ++ text.trim(5, -1)`. |
| `.getProto()` | None. |
| `.JsonParse()` | `json.parse(text)`. |
| `.oslTokenise()` | None. `.split(" ")` splits on spaces, and does not keep quoted text together. |
| `.toOrdArray()` | `.toBytes()` gives the UTF-8 bytes, and `.ord()` the code of one character. |
| `.wrapText(n)` | None. |
| `.encodeUTF16()`, `.decodeUTF16()` | [`std:encodings/utf16`](../../packages/encodings-utf16.md), which works on UTF-16 lengths and positions as JavaScript does. |
| `.encrypt(password)`, `.decrypt(password)` | `crypto.encrypt(bytes, password)` and `crypto.decrypt(data, password)` from [`std:crypto`](../../packages/crypto.md). |

```legacy
str = "helllo world"
log str.delete(4)              // "hello world"

log "Hello".toOrdArray()       // ["72", "101", "108", "108", "111"]

secret = "secret message".encrypt("myPassword123")
log secret.decrypt("myPassword123")   // "secret message"
```

```osl
import "std:crypto"

string word = "helllo world"
log word.left(3) ++ word.trim(5, -1)

log "A".ord()
log "Hello".toBytes().len

string secret = crypto.encrypt("secret message".toBytes(), "myPassword123")
log crypto.decrypt(secret, "myPassword123").unwrap()
```

```output
hello world
65
5
secret message
```

The old `toOrdArray` returned its numbers as strings. `toBytes()` returns real bytes. A wrong password does not give garbled text now: `crypto.decrypt` returns an error result, because the data is authenticated.

## Numbers

| Legacy | Today |
| --- | --- |
| `.append(val)`, `.prepend(val)` | Join with `++`, which turns the number into text. |
| `.padStart(val, n)`, `.padEnd(val, n)` | Make the number text, then `text.padStart("0", n)`. The padding comes first. |
| `.newString()` | `" " * n` repeats a string. |
| `.newArray()` | Declare the array and `resize` it, or use a loop. |
| `.chance()` | `random.bool(probability)` from [`std:random`](../../packages/random.md), with a probability from 0 to 1. |
| `.toBase(from, to)` | `strconv.FormatInt(n, base)` from Go's `strconv`. |
| `.getProto()` | None. |

```legacy
log 42.append("px")        // "42px"
log 99.prepend("ID-")      // "ID-99"
log 7.padStart("0", 3)     // "007"
log 123.padEnd("0", 5)     // "12300"
log 4.newString()          // four spaces
log 50.chance()            // true half the time
log 255.toBase(10, 16)     // "ff"
```

```osl
import "go:strconv"
import "std:random"

int n = 42
log n ++ "px"
log "ID-" ++ 99
log 7.toStr().padStart("0", 3)
log 123.toStr().padEnd("0", 5)
log (" " * 4) ++ "|"
log random.bool(1)
log strconv.FormatInt(255, 16)
```

```output
42px
ID-99
007
12300
    |
true
ff
```

## Arrays, objects and types

| Legacy | Today |
| --- | --- |
| `array.getProto()`, `object.getProto()` | None. |
| `value.isType("number")` | `typeof(value) == "number"`. The type names are `string`, `number`, `boolean`, `array`, `object` and `null` for values of unknown type. |

```legacy
val = 16
log val.isType("number")     // true
```

```osl
import "std:json"

any value = json.parse("16").unwrap()
log typeof(value) == "number"
log typeof(value)
```

```output
true
number
```

For a value of a known type, `typeof` is not needed, and the compiler warns that its answer is always the same. Use it for values that can be more than one type, such as parsed JSON.

## Why they went

The helpers made sense in an interpreter, where every value carried its methods and any name could be looked up at run time. A compiler checks that a method exists before the program runs, and keeps the standard library in packages so that a program only carries what it uses. A helper that opened a dialog (`.confirm`), encrypted without authentication, or read an interpreter's own prototype tables did not fit that design.

See [Legacy OSL](index.md) for the other differences.
