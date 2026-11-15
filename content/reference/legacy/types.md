---
description: The six dynamic types of the original OSL, and how each became a typed declaration in the compiled language.
---

# Legacy types

The original OSL had six types, and a variable could hold any of them: whatever was assigned last decided its type, and the runtime checked types as the program ran. Today's OSL declares a type for every variable and checks it before the program runs. This page lists the six original types with their legacy code, and shows each one in today's syntax.

The old examples assign without declaring (`name = "Hello"`). That is a compile error now:

```osl error
name = "Hello"
log name
```

Declare the type (`string name = "Hello"`), or write `auto name = "Hello"` to let the compiler work it out.

## The six types

### String

Text in double quotes. Single quotes were not strings.

```legacy
name = "Hello"
message = "Hello, World!"
path = "C:/Users/Documents"
```

Today it is `string`:

```osl
string name = "Hello"
string message = "Hello, World!"
string path = "C:/Users/Documents"
log name message
log path
```

```output
Hello Hello, World!
C:/Users/Documents
```

### Boolean

`true` or `false`, in any capitalisation: `True` worked too.

```legacy
isTrue = true
both = true and false       // false
```

Today it is `boolean`, and the values are written in lower case. The operators are `and`, `or`, `!` (not) and `^^` (xor).

```osl
boolean isTrue = true
boolean both = true and false
log isTrue both
log !isTrue
```

```output
true false
false
```

### Number

One type for integers and decimals.

```legacy
count = 42
negative = -10
price = 19.99
total = 10.5 + 20      // 30.5
```

Today there are two common types: `int` for whole numbers, and `number` for anything that may have a decimal part. There are also sized types such as `int8` and `float32` for binary formats.

```osl
int count = 42
int negative = -10
number price = 19.99
number total = 10.5 + 20
log count negative price total
```

```output
42 -10 19.99 30.5
```

### Array

Ordered values in square brackets, of mixed types if you liked.

```legacy
names = ["Alice", "Bob", "Charlie"]
data = [1, "two", true, 4.5]
matrix = [[1, 2], [3, 4]]
empty = []
```

Today an array has an item type, written with `[]` after it. A list of mixed types is `any[]`, but a typed array is almost always better:

```osl
string[] names = ["Alice", "Bob", "Charlie"]
int[][] matrix = [[1, 2], [3, 4]]
int[] empty = []
log names
log matrix
log empty.len
log names[1]
```

```output
["Alice","Bob","Charlie"]
[[1,2],[3,4]]
0
Alice
```

Positions still count from 1.

### Object

Key-value pairs in braces, with unquoted keys.

```legacy
person = {
  name: "John",
  age: 30
}
```

Today `object` is still available for flexible data. When the shape is known, a [struct](../../learn/structs.md) names each field and its type, so a misspelt key is a compile error:

```osl
struct Person (
  string name = ""
  int age = 0
)

object person = {name: "John", age: 30}
Person typed = Person("John", 30)
log person
log typed.name typed.age
```

```output
{"age":30,"name":"John"}
John 30
```

Object keys print in sorted order.

### null

The empty value.

```legacy
value = null
if value == null (
  log "Value is null"
)
```

Today a variable can hold `null` only if its type says so, with a `?` after the type. This turns a whole class of run-time errors into compile errors:

```osl
string? middleName = null
if middleName == null (
  log "no middle name"
)
```

```output
no middle name
```

## Checking a type

The legacy `typeof()` returned one of `"string"`, `"number"`, `"boolean"`, `"array"`, `"object"` and `"null"`, and every value had `.getType()` and `.isType("...")`. `typeof` still exists, and is for values whose type is not known until the program runs, such as parsed JSON:

```osl
import "std:json"

string[] texts = ["\"hi\"", "42", "true", "[1, 2]", "{\"a\": 1}", "null"]
for text in texts (
  auto value = json.parse(text).unwrap()
  log text "is" typeof(value)
)
```

```output
"hi" is string
42 is number
true is boolean
[1, 2] is array
{"a": 1} is object
null is null
```

For a variable with a declared type, `typeof` is redundant, and the compiler warns about it. See the [types lesson](../../learn/types.md) for everything the modern type system offers.

## Rules that changed

| Legacy | Today |
| --- | --- |
| Strings must use double quotes. | Still true. Backticks make templates and multi-line strings. |
| Booleans are case-insensitive. | Write `true` and `false`. |
| Numbers match `[0-9.\-]+`. | Numbers are `int`, `number`, or a sized type. |
| Arrays can mix types. | Arrays have an item type. Use `any[]` to mix. |
| Object keys need no quotes. | Still true. Wrap a key in brackets to compute it: `{[name]: 1}`. |
| Any variable can hold `null`. | Only types ending in `?` can. |
| `.getType()` on every value. | `typeof(value)`. |

See [Legacy OSL](index.md) for the other differences.
