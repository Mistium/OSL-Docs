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

### Nullable values from packages

A package function whose answer may be "nothing there" returns `T?`, such as `cache.get(key)`,
`regex.findFirst(text)`, or a `*cache.Cache`'s `ttl(key)`, which is `int?`. Narrow it with `??`, a
null check, or an assertion with a fallback before using it as a `T`:

```osl
import "std:cache"

*cache.Cache c = cache.new()
int? left = c.ttl("token")
int ms = left ?? 0
if left != null ( log left > 1000 )
log ms
```

Assigning a `T?` to a non-nullable `T` is a compile error. So are three comparisons that would
silently go wrong, because `null` equals none of `""`, `0`, and `false` and has no order:

| Code, with `c.ttl(key)` returning `int?` | Compile error |
| --- | --- |
| `c.ttl("token") == 0` (also `!=`, and `""` or `false` for `string?` or `boolean?`) | `c.ttl("token") is int? and may be null, which never equals 0. Compare it with null to test for a missing value, or write (c.ttl("token") ?? 0) == 0 to treat null as 0.` |
| `c.ttl("token") > 5` (any of `<`, `<=`, `>`, `>=`) | `c.ttl("token") is int? and may be null, which has no order. Check it against null first, or give it a fallback with ?? before comparing.` |
| `"left: " ++ c.ttl("token")` or `` `left: ${c.ttl("token")}` `` | `c.ttl("token") is int? and may be null, which ++ writes as "null"; use ?? "" (or check for null).` |

Compare with `null` to test for a missing value, or give a fallback first:
`(c.ttl("token") ?? 0) == 0`, `"left: " ++ (c.ttl("token") ?? 0)`. After `if x != null`, the
value is narrowed and these forms compile. An `else if` condition also sees the checks before it,
so after `if name == null ( ... )`, `else if name.len > 3` reads `name` as a `string`.

`log`, `say`, `warn`, and `error` may still print a `T?` as it is, so `log "left: " ++ c.ttl("x")`
prints `left: null`.

These rules mean a function that changes from returning a sentinel such as `""` or `0` to returning
`T?` breaks old checks like `if c.query("id") == ""` at compile time instead of quietly changing
what they mean.

A `result` can hold a nullable value too: `result<string?, error>` unwraps to a `string?`.

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

*serve.Router app = serve.new()
```

## Records from packages

Many package functions return a record: an object with a fixed set of keys, every one always
present. The compiler knows the keys and their types, so reading any other key is a compile error,
and hover and completion list the fields:

```osl
import "std:cache"

*cache.Cache c = cache.new({capacity: 10})
auto info = c.info()
log info.capacity // 10
// log info.capcity
// TypeError: Property 'capcity' does not exist on {capacity: int, size: int, ttl: number}
```

A field that may be absent has a nullable type, such as the `int?` `nextRun` of a
[`cron`](../packages/cron.md) job, and follows the nullable rules above. A function that may find
no record returns a nullable record, written `{name: string, ...}?` in diagnostics. A record
converts to an ordinary `object` when you assign or pass it as one.

## Assertions

Use `.<T>` when a dynamic value must already have a specific runtime type:

```osl
import "std:ws"

any[] values = [{name: "Ada"}, null]
object record = values[1].<object>
log record.name

any raw = values[2]
*ws.Connection? conn = raw.<*ws.Connection?>
log conn == null // true
```

`.<T>(fallback)` returns the fallback after a mismatch. When the fallback has an unambiguous type, omit `T`:

```osl
any[] values = [42]
string name = values[1].<>("")
object data = values[1].<object>({})
log name.len // 0
log data     // {}
```

- `.<T>()` uses the zero value of the type as its fallback, such as `value.<array>()` or `value.<string>()`.
- Negated assertions `.<!T>` check that a value is never that type. `.<!null>` asserts a non-null value, and `.<!null>(fallback)` supplies a default when null.
- Nullable assertions `.<T?>` accept null unchanged. `.<string?>` and `.<string?>(fallback)` return null for null or missing values, retain strings, and fail or use the fallback for other values.
- `.as<T>` converts a value. An assertion checks its existing type; a failed known assertion recommends the relevant conversion.
- `.<number>` accepts an `int` too and gives it back as a `number`, as a `number` parameter does. `typeof(x) == "number"` still compares the type name, so it is `false` for an `int`.

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
any[] values = ["12.5", "true"]
string text = values[1].toStr()
number decimal = text.toNum()
int whole = decimal.toInt()
boolean enabled = values[2].toBool()
log whole   // 12
log enabled // true
```

Conversion is different from assertion. Conversion attempts to produce another representation. Assertion checks the existing runtime type.

Integer values widen into `number` targets freely, so an `int` variable can be assigned or passed wherever a `number` is expected. Going the other way, a `number` narrows into an `int` target automatically only when the value is written out directly: a literal, an operator result such as `n + 1`, or a compound assignment such as `count += n`. A value flowing through a variable, call, or member access must convert explicitly with `.toInt()`:

```osl
number n = 1.5
int a = n + 1   // fine: the operator result narrows automatically
int b = n       // TypeError: convert the value explicitly
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

### Arguments to package functions

A call to a package function or a handle method converts each argument to the parameter's type,
the same way for every package:

- A `byte[]` parameter accepts a `byte[]`, an array of whole numbers from 0 to 255, or a string,
  which is used as its UTF-8 bytes.
- Typed array and object parameters accept any OSL array or object, converted item by item.
- A whole-number parameter rejects fractions: `random.between(1.5, 3)` is a compile error, and a
  fractional variable throws `ValueError` when the call runs. A number too large for the parameter
  also throws `ValueError`.
- A value of the wrong type throws `TypeError`. The message names the call and the parameter.
- An options object is checked too: an unknown or misspelled key throws `ValueError` with a
  suggestion and the accepted keys, such as
  `retry.call: unknown option "max_delay" (did you mean "maxDelay"?)`.

Some mistakes are caught before the program runs. Each of these is a compile error:

- a package function or constant that doesn't exist, such as `random.int(6)`, with a suggestion
  when a current name is close;
- the wrong number of arguments to a package function or handle method, such as
  `random.between(1)`;
- a value that isn't an object where an options object is expected, such as
  `retry.delayFor(1, 100)`.

## Null values and type checks

`typeof` reports `"null"` for null values, including missing nullable entries in typed dictionaries. A null object or array fails the corresponding `typeof(value) == "object"` or `"array"` guard. Allocated empty objects and arrays retain their collection type.

A null dynamic value flows into any nullable parameter or declaration. `array? items = record.missing` and a call such as `count(record.missing)` for `def count(array? items)` receive `null`. A present value of another type still fails, for example `TypeError: Expected array, got int`. A non-nullable `array` parameter or declaration checks a dynamic value in the same way: a present non-array value fails with `TypeError: Expected array, got string; use .<array>([]) for a fallback` instead of being wrapped, and a null value becomes an empty array, as a null value becomes an empty object for `object`. Use `.toArray()` to convert a value to an array explicitly. Assigning a dynamic value to a non-nullable collection that the compiler cannot convert reports both types and the valid narrowing: `.<array>`, `.<array>(fallback)`, or `.<array?>` when null is allowed.

The quoted string `"null"` is an ordinary string. Assigning it to a string variable or comparing against it does not make it a null literal or narrow a nullable variable. Use the unquoted `null` value for null checks.
