# Built-ins and value methods

This page covers language-level APIs that do not require an import. Standard-library APIs live under [Packages](../packages/README.md).

## Core functions

| Function | Purpose |
| --- | --- |
| `typeof(value)` | Returns the runtime type name. When the value has a single known type, the comparison folds at compile time and warns as a constant condition. |
| `len(value)` | Returns the length of a supported value. |
| `string(value)` | Converts a value to text. Prefer `.toStr()` in application code. |
| `number(value)` | Converts a value to a decimal number. Prefer `.toNum()`. |
| `int(value)` | Converts a value to an integer. Prefer `.toInt()`. |
| `boolean(value)` | Converts a value using OSL truthiness. Prefer `.toBool()`. |
| `array(value)` | Converts a supported value to an array. |
| `object(value)` | Converts a supported value to an object. |
| `min(...values)` | Returns the smallest numeric value, or NaN when any value is NaN. The smallest of ints is an `int`. Given one array, `min(values)` returns its smallest item, as `values.min()` does. |
| `max(...values)` | Returns the largest numeric value, or NaN when any value is NaN. The largest of ints is an `int`. Given one array, `max(values)` returns its largest item, as `values.max()` does. An empty array has no smallest or largest item, so `min` and `max` of one raise `ValueError`. |
| `clamp(value, low, high)` | Restricts a number to a range, as `value.clamp(low, high)` does. The bounds may come in either order. Of ints, it returns an `int`. |
| `round(value)`, `floor(value)`, `ceil(value)`, `abs(value)` | Basic numeric operations. `round` rounds halves up, so `round(-2.5)` is `-2`, and returns `0` for NaN or values outside the integer range. Of an `int`, each returns an `int`: `round`, `floor` and `ceil` return the value itself, and `abs` its size. The minimum `int` has no `int` size, so `abs` of it raises `OverflowError`. |
| `sqrt(value)`, `pow(base, exponent)` | Roots and powers. `pow(base, exponent)` is `base ^ exponent`, a `number` even for ints, since a power can be fractional or too large for an `int`. |
| `sin(value)`, `cos(value)`, `tan(value)` | Trigonometric functions of an angle in degrees, matching the number methods. |
| `random(low, high)` | Returns a random whole number from `low` to `high` inclusive, or a decimal from `low` up to but not including `high`. |
| `range(start, end)` | Creates an inclusive range. The `to` operator is usually clearer. |
| `keys(object)`, `values(object)`, `entries(object)` | Reads object contents. |
| `btoa(value)`, `atob(value)` | Base64 encode and decode. `atob` returns the decoded bytes as a string, or `""` for invalid input. |
| `symbol(name)` | Creates a symbol value. |
| `sleep(seconds)` | Blocks for a duration in seconds. |

## Methods on every value

| Method | Result |
| --- | --- |
| `.as<T>` | Explicit conversion to a scalar or collection type |
| `.tryAs<T>` | Checked conversion returning `result<T, error>` |
| `.toStr()` | String conversion |
| `.toNum()` | Number conversion |
| `.toInt()` | Integer conversion |
| `.toBool()` | Boolean conversion |
| `.getType()` | Runtime type name |
| `.assert(type)` | Runtime type assertion |
| `.assertElse(type, fallback)` | Assertion with a fallback |
| `.assertElse(fallback)` | Assertion with the type inferred from the fallback |
| `.len` or `.len()` | Length where supported |
| `.contains(value)` | Membership where supported |

Assertion shorthand uses `value.<type>` for `.assert(type)` and `value.<type>(fallback)` for `.assertElse(type, fallback)`. A nullable type such as `value.<string?>` accepts `null`. Assertions check the runtime type and never convert, so asserting a string as `byte[]` fails; use `.toBytes()`. Keep the fallback's opening parenthesis adjacent to `>`. A space separates a following block, as in `for value in items.<array> (`.

Assertions and conversions preserve read-only protection for reference values obtained
through `const<T>`. Built-in read operations remain available on const collections, while
mutating methods are rejected. `.clone()` creates an independent deep copy that can be
modified. See [const types](../guide/types.md#const-types) for binding and alias rules.

## Strings

Common string methods include:

```text
append       prepend       insert        delete
contains     containsAny   startsWith    endsWith
index        lastIndex     count         match
replace      replaceFirst  split         left          right
trim         trimText      strip         stripStart    stripEnd
toUpper      toLower       toTitle       toMixed
padStart     padEnd        reverse       toBytes
toArr        ord           btoa          atob
encodeHex    decodeHex     encodeBin     decodeBin
hashMD5      hashSHA1      hashSHA256    hashSHA512
```

String positions are 1-based. Indexing, iteration, `trimText`, and `toMixed` use Unicode code points. `match(pattern)` always returns an array of matches, which is empty when nothing matches. `.len` counts characters (Unicode code points); use `.toBytes().len` for the UTF-8 byte size.

There is no `repeat` method. Use multiplication, as in `"a" * 3`.

`.toBytes()` returns a string's raw bytes as `byte[]`, so `data.atob().toBytes()` decodes base64 text to bytes.

## Arrays

Common array methods include:

```text
append       prepend       insert        delete
pop          shift         fill          swap
contains     index         first         last
left         right         trim          concat
map          filter        some          every
sort         sortBy        reverse       randomOf
join         clone         getKeys       getValues
min          max           sum           product
resize       iter
```

`iter()` returns a lazy iterator over the items; see [Iterators and generators](../guide/iterators.md).

Array positions are 1-based. Mutating methods change the original array, including arrays stored in object fields or array items, so `o.list.append(x)` and `grid[1].pop()` update the stored array. `.clone()` creates an independent deep copy.

Array pointers created with `@arrayVariable` support `.delete(position)` and `.len`. Pointer deletion updates the original variable's array and length and returns the same pointer. It uses 1-based positions and leaves the array unchanged for out-of-range positions. Generic functions can require an array pointer with [`<*_[] T>`](../guide/functions.md#array-pointer-constraints).

`sort` orders numbers numerically and other values by their string form. `sortBy("field")` places elements missing the field last. `join` renders nested arrays and objects as JSON, like `.toStr()`.

`left`, `right`, and `trim` return arrays that do not share storage with the source, so appending to the result never changes the original. `append`, `prepend`, `insert`, `delete`, `resize`, `fill` and `swap` change the array in place and return that same array, so they chain and work as expressions: `items.append(1).append(2)`, `for item in items.append(3) (...)`, `if items.delete(1).len > 2 (...)`, and on temporaries such as `items.clone().insert(1, 0).delete(2)`. `pop` and `shift` return the removed item. `delete` with an index out of range leaves the array unchanged. Use `items.clone().delete(1)` for a changed copy; the compiler warns (OSL-DELETE-IN-PLACE) when such a method's result on a named array is bound to a different variable or field, as in `b = a.delete(1)`, because both names then refer to `a`'s array. `trim(start, end)` is inclusive and accepts negative positions counted from the end, so `"hello".trim(-3, -1)` is `"llo"`; reversed bounds are swapped.

## Objects

Common object methods include `getKeys`, `getValues`, `getEntries`, `contains`, `insert`, `delete`, `pick`, `omit`, `clone`, `toStr`, `jsonParse`, and `getProto`.

On objects and typed maps, `delete` takes one or more keys, removes each of them from the object itself and returns that same object, like the in-place array methods: `scores.delete("ada", "bo")` leaves `scores` without either key, keys that aren't there are ignored, and `scores.delete("ada").len` counts what is left. `omit` takes the same keys and returns a new object without them, leaving the original as it was. The compiler warns (OSL-DELETE-IN-PLACE) when `delete`'s result on a named object is bound to a different variable or field, as in `b = a.delete("x")`, because both names then refer to `a`; use `a.omit("x")` for a changed copy. Arrays keep `delete(index)` with a single index.

Cloning a null value returns null.

Objects return `null` for missing fields. Assignment shares the object; `.clone()` makes a deep copy and preserves a typed dictionary's key and value types.

```osl
string[object] roles = {user: {position: 1}}
string[object] copied = roles.clone()
copied["user"].position = 2
log roles["user"].position // 1
```

A bare key name is literal: `{key: 1}` has the key `"key"`. Wrap an expression in brackets to compute the key, as in `{[key]: 1}` or `{["user_" ++ id]: data}`. Parentheses group an expression as they do everywhere else, so `{(key): 1}` also computes the key.

Object shorthand resolves variable names even when they match a command name. For example, `string error = "failed"` followed by `{error}` creates `{error: "failed"}`.

## Numbers and booleans

Numbers provide methods such as `round`, `floor`, `ceiling`, `abs`, `sqrt`, `clamp`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `sign`, `isPrime`, and `chr`.

On an `int`, `round`, `floor`, `ceiling` and `abs` return an `int`, as their functions do, and `clamp` with `int` bounds returns an `int`. Results that can be fractional, such as `sqrt` or `clamp` with a decimal bound, are numbers.

`sqrt`, `asin`, and `acos` return `number?`: `null` when the input is outside their domain. Use a
fallback such as `x.sqrt() ?? 0.0` where a number is required.

Booleans support the universal conversion, type, assertion, and prototype methods.

## Prototypes

Strings, arrays, objects, numbers, and functions can resolve methods through prototypes. Prefer ordinary functions or named types for application structure. Prototype changes are global to the value type and are harder to trace in a large project.

## Nullish fallback

`??` uses its fallback only when the left value is null. Fallbacks can be chained, including when several consecutive values are null: `primary ?? backup ?? 42` returns `42` when both variables are null.

Null guards also narrow nullable typed arrays, typed dictionaries, and named records. After `if values == null return`, a `string[]?` value can use string-array methods without an assertion.

Package handles report their qualified `typeof` name, such as `*cache.Cache` or `*process.Process`.
Built-in `xml`, `map`, `set`, `canvas`, `option`, and `result` values keep their language type names.
