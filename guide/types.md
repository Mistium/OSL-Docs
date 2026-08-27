# Types

OSL can keep values dynamic or check them against declared types. Types affect diagnostics, method resolution, generated Go, and package-handle calls.

## Core types

| Type | Example |
| --- | --- |
| `string` | `"hello"` |
| `int` | `42` |
| `number` | `42.5` |
| `boolean` or `bool` | `true` |
| `array` | `[1, "two"]` |
| `object` | `{name: "Ada"}` |
| `any` | Any runtime value |
| `null` | `null` |

An integer literal has type `int`. A decimal literal has type `number`.

## Nullable values

Append `?` when a value may be `null`:

```osl
string? nickname = null

def findName(string id) string? (
  if id == "owner" return "Ada"
  return null
)
```

A trailing nullable function parameter may be omitted. A nullable parameter before a required parameter still has to be passed.

```osl
def greet(string name, string? prefix) string (
  return (prefix ?? "Hello") ++ ", " ++ name
)

log greet("Ada")
```

## Typed arrays and maps

`T[]` is a growable typed array:

```osl
string[] names = []
names.append("Ada")
```

`T[size]` is a fixed-size array. Omitted elements receive the type's zero value, and methods that change the length are compile errors.

```osl
int[3] scores = [10]
scores[2] = 20
```

`key[value]` describes a typed map:

```osl
string[number] totals = {
  apples: 3,
  pears: 5
}
```

Nested forms are allowed:

```osl
string[object[]] messagesByChannel = {}
```

Package handle types use the package name. Pointer handles start with `*`:

```osl
import "std:serve"

*serve.Router app = serve.New()
```

## Assertions

Use `.assert(type)` when a dynamic value must have a specific runtime type:

```osl
any value = loadValue()
object record = value.assert(object)
```

The generic shorthand is equivalent:

```osl
object record = value.<object>()
```

`.assertElse(type, fallback)` returns the fallback after a mismatch. When the fallback has an unambiguous type, omit the type argument:

```osl
string name = value.assertElse("")
object data = value.assertElse(object, {})
```

The compiler warns about assertions it can prove redundant and rejects assertions it can prove impossible.

## Narrowing

A `typeof` comparison narrows an `any` or union value inside the matching branch:

```osl
def normalize(any value) string (
  if typeof(value) == "string" (
    return value.trim()
  )
  return value.toStr()
)
```

## Unions and aliases

Join accepted types with `|` and name repeated types with `type`:

```osl
type Identifier = string | int

def display(Identifier id) string (
  return id.toStr()
)
```

## Conversion

The most common conversions are methods:

```osl
string text = value.toStr()
number decimal = text.toNum()
int whole = decimal.toInt()
boolean enabled = value.toBool()
```

Conversion is different from assertion. Conversion attempts to produce another representation. Assertion checks the existing runtime type.
