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
Negating an `int` gives an `int`. Words such as `NaN`, `inf`, and `_1` are ordinary identifiers, not
number literals; use `"NaN".toNum()` to produce NaN.

## Strings

Strings use double or single quotes. A backslash escapes the next character, so a string whose
closing quote is escaped, such as `"abc\"`, is unterminated and reported as an error.

Backtick strings interpolate `${...}` expressions:

```osl
string[] items = ["p", "q"]
log `items: ${items.join(`, `)}`
log `total: ${ {a: 1}["a"] }`
log `literal \${name}`
```

Escapes in the literal text are processed once, and code inside `${...}` is compiled as written, so it
can contain braces, quotes, and nested backtick strings. Write `\${` for a literal `${`.

## Nullable values

Append `?` when a value may be `null`:

```osl
string? nickname = null

def findName(string id) string? (
  if id == "owner" return "Ada"
  return null
)
```

A function with a non-nullable return type cannot return `null` or a map lookup that may be
absent. Declare a nullable return type or handle the missing value before returning.

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

A typed map lookup may be absent when its value type can hold `null`, including objects, arrays,
pointers, functions, and `any`. The compiler requires a nullable destination, a null guard, or an
assertion:

```osl
string[object] users = {}

object? found = users["ada"]
object displayed = users["ada"].assertElse(object, {name: "Unknown"})
```

Map values with non-nullable scalar types keep their zero-value behavior. For example, a missing
value in `string[number]` reads as `0`.

Typed map and array value types are invariant. The compiler rejects passing or assigning a typed map
or array where the expected element or value type differs (such as passing `string[string]` to a
function expecting `string[string?]` or `object`), preventing runtime type conversion panics.

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
object record = value.<object>
*ws.Connection conn = raw.<*ws.Connection>
```

`.assertElse(type, fallback)` returns the fallback after a mismatch. When the fallback has an unambiguous type, omit the type argument:

```osl
string name = value.assertElse("")
object data = value.assertElse(object, {})
```

Shorthand assertion aliases are also supported:
- `.<>(fallback)` is an alias for `.assertElse(fallback)` (e.g. `val.<>("")`).
- `.<type>()` defaults to the zero value of the type (e.g. `val.<array>()` becomes `.assertElse(array, [])`, `val.<string>()` becomes `.assertElse(string, "")`).
- Negated type assertions `!type` assert that a value is never that type. For example, `.<!null>` asserts that a value is non-null, and `.<!null>(fallback)` provides a default when null.

Asserting a value as `any` is meaningless and rejected as a compile error. The compiler also warns about assertions it can prove redundant and rejects assertions it can prove impossible.

## Narrowing

A `typeof` comparison narrows an `any` or union value inside the matching branch. Comparisons against type names lower directly to native type assertions without allocating runtime strings:

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

The compiler warns about conversions it can prove redundant. A conversion on a value that already has the target type can be removed, a repeated conversion such as `.toNum().toNum()` names the duplication, and a `.toStr().toNum()` or `.toNum().toStr()` roundtrip collapses to the final conversion:

```osl
string name = "Ada"
log name // not name.toStr()

any raw = "12"
log raw.toNum() // not raw.toStr().toNum()
```

Repeated idempotent calls such as `.trim().trim()` or `.toLower().toLower()` warn in the same way; the second call has no additional effect.

Comparing a known `boolean` to `true` or `false` also warns; use the value or its negation directly. Comparing a dynamic value such as `any` or `boolean?` to `true` is a boolean coercion and does not warn, so keep the `== true` form there.

## Null values and type checks

`typeof` reports `"null"` for null values, including missing nullable entries in typed dictionaries. A null object or array fails the corresponding `typeof(value) == "object"` or `"array"` guard. Allocated empty objects and arrays retain their collection type.

The quoted string `"null"` is an ordinary string. Assigning it to a string variable or comparing against it does not make it a null literal or narrow a nullable variable. Use the unquoted `null` value for null checks.
