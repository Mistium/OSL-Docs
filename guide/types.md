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

## Const types

`const<T>` makes a binding non-reassignable and provides a read-only view of `T`:

```osl
const<int> limit = 10
const<int[]> values = [1, 2, 3]
log limit
log values[1]
```

Reassignment, compound assignment, increments, item and field writes, and mutating
methods such as `append`, `sort`, `reverse`, and `delete` produce compile errors.
The checks also apply inside closures, through nested collection reads, and when
assigning existing destructuring targets.

Const collections support reading and nonmutating methods. Reference values obtained
from a const view remain read-only through assertions, conversions, method chains,
iteration, and inferred aliases. A const reference cannot be assigned to an explicitly
mutable destination, returned with a mutable return type, or passed to a mutable
parameter. Copy a scalar normally, or clone a collection for an independent deep copy:

```osl
int editableLimit = limit
editableLimit++
int[] editableValues = values.clone()
editableValues.append(4)
```

Const is a view rather than a global freeze. Another existing mutable alias can still
change the shared data:

```osl
int[] source = [1, 2]
const<int[]> view = source
source[1] = 9
log view[1] // 9
```

Use const in parameter and return contracts:

```osl
def total(const<int[]> values) int (
  return values.sum().as<int>
)

def defaults() const<int[]> (
  return [1, 2, 3]
)

log total(defaults())
```

A const parameter requires a const value or a literal. Mutable variables do not satisfy
it implicitly, including scalar variables initialized with literals. Create an explicit
view with a `const<T>` declaration or `.as<const<T>>`:

```osl
def read(const<int> value) int -> value
int editable = 10
const<int> fixed = editable
log read(fixed)
log read(10)
log read(editable.as<const<int>>)
// read(editable) // compile error
```

Const return contracts also require a const value or a literal. Constructor arguments,
collection element types such as `const<int>[]`, and function type contracts retain the
same requirement. A const return protects the caller's view. Callbacks receiving
reference elements from a const collection must also accept const parameters; inferred lambda parameters retain that protection. A generic function
returning an element of `const<T[]>` should return `const<T>` when `T` might be a reference.

User-defined and foreign methods on const reference receivers are rejected because the
compiler has no declaration proving those methods do not mutate the receiver. Built-in
read operations and deep cloning remain available.

Aliases can name const types. Record, struct, and class fields may also use `const<T>`;
initialize them with their declaration or constructor rather than updating them later.
Const requires exactly one explicit type. Nullable forms include `const<string?>`.
Bare `const name = ...` and `const<auto>` are unsupported.

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

Elements are converted to `T` when they are added. A numeric string such as `"7"` becomes a number
in `int[]` or `number[]`, but a string that is not a number is a `TypeError`, at compile time for a
literal and at runtime for a value.

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
object displayed = users["ada"].<object>({name: "Unknown"})
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

Use `.<T>` when a dynamic value must already have a specific runtime type:

```osl
any value = loadValue()
object record = value.<object>
*ws.Connection conn = raw.<*ws.Connection>
```

`.<T>(fallback)` returns the fallback after a mismatch. When the fallback has an unambiguous type, omit `T`:

```osl
string name = value.<>("")
object data = value.<object>({})
```

- `.<T>()` uses the zero value of the type as its fallback, such as `value.<array>()` or `value.<string>()`.
- Negated assertions `.<!T>` check that a value is never that type. `.<!null>` asserts a non-null value, and `.<!null>(fallback)` supplies a default when null.
- Nullable assertions `.<T?>` accept null unchanged. `.<string?>` and `.<string?>(fallback)` return null for null or missing values, retain strings, and fail or use the fallback for other values.
- `.as<T>` converts a value. An assertion checks its existing type; a failed known assertion recommends the relevant conversion.

Compiler and runtime diagnostics use these current forms for assertions, fallbacks, and conversions. Assertion warning codes remain unchanged.

```osl
def label(string? name) string -> name ?? "anonymous"

object user = {name: "Ada", age: 36}
log label(user.name.<string?>)     // Ada
log label(user.nickname.<string?>) // anonymous
log label(user.age.<string?>("?")) // ?
```

An assertion checks the runtime type and never converts the value. A string is never a `byte[]`, so `text.<byte[]>` fails and `text.<byte[]>(fallback)` returns the fallback. When the string's type is known, the compiler reports the conversion to use instead. Convert text to bytes with `.toBytes()`, and decode base64 text, such as a data URI payload, with `atob`:

```osl
string upload = "aGk="
byte[] body = upload.atob().toBytes()
```

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

## Checked conversion

`.tryAs<T>` returns `result<T, error>` instead of silently producing zero or wrapping
an out-of-range integer:

```osl
result<int8, error> parsed = "42".tryAs<int8>
int8 value = parsed.unwrapOr(0)
log parsed.isOk()
log (128).tryAs<int8>.isErr()
```

Targets include signed and unsigned integer widths, floating point types, strings,
booleans, aliases, typed arrays, and typed objects (`array<T>` and `map<K, V>` included).
Invalid numeric text, null numeric inputs, nonfinite values, overflow, and negative
integers converted to unsigned types produce an error. Fractions truncate toward zero
before checking the target range. Integer text retains exact 64-bit precision.
Boolean targets accept booleans and the strings `"true"` and `"false"`; other inputs fail.
String targets use the usual text conversion.

Collection targets build a new collection and validate every element and key
recursively. A failed element conversion leaves the source intact. Converted object
keys must remain distinct. Null and noncollection sources fail collection conversion.

Use `.isErr()` or `.unwrapErr()` to inspect the error, or `.unwrapOr(fallback)` to choose
a default. `.unwrap()` returns the typed success value and throws for an error result.

## Conversion

The most common conversions are methods:

```osl
string text = value.toStr()
number decimal = text.toNum()
int whole = decimal.toInt()
boolean enabled = value.toBool()
```

Conversion is different from assertion. Conversion attempts to produce another representation. Assertion checks the existing runtime type.

Integer values widen into `number` targets freely, so an `int` variable can be assigned or passed wherever a `number` is expected. Going the other way, a `number` narrows into an `int` target automatically only when the value is written out directly: a literal, an operator result such as `n + 1`, or a compound assignment such as `count += n`. A value flowing through a variable, call, or member access must convert explicitly with `.toInt()`:

```osl
number n = 1.5
int a = n + 1   // fine: the operator result narrows automatically
int b = n       // TypeError: convert the value explicitly with .toInt()
int c = n.toInt() // fine
```

Strings convert to bytes with `.toBytes()`, which returns the string's raw bytes. Bytes convert back with `.toStr()`.

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

A null dynamic value flows into any nullable parameter or declaration. `array? items = record.missing` and a call such as `count(record.missing)` for `def count(array? items)` receive `null`. A present value of another type still fails, for example `TypeError: Expected array, got int`. A non-nullable `array` parameter or declaration checks a dynamic value in the same way: a present non-array value fails with `TypeError: Expected array, got string; use .<array>([]) for a fallback` instead of being wrapped, and a null value becomes an empty array, as a null value becomes an empty object for `object`. Use `.toArray()` to convert a value to an array explicitly. Assigning a dynamic value to a non-nullable collection that the compiler cannot convert reports both types and the valid narrowing: `.<array>`, `.<array>(fallback)`, or `.<array?>` when null is allowed.

The quoted string `"null"` is an ordinary string. Assigning it to a string variable or comparing against it does not make it a null literal or narrow a nullable variable. Use the unquoted `null` value for null checks.
