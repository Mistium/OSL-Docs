# Built-ins and value methods

This page covers language-level APIs that do not require an import. Standard-library APIs live under [Packages](../packages/README.md).

## Core functions

| Function | Purpose |
| --- | --- |
| `typeof(value)` | Returns the runtime type name. |
| `len(value)` | Returns the length of a supported value. |
| `string(value)` | Converts a value to text. Prefer `.toStr()` in application code. |
| `number(value)` | Converts a value to a decimal number. Prefer `.toNum()`. |
| `int(value)` | Converts a value to an integer. Prefer `.toInt()`. |
| `boolean(value)` | Converts a value using OSL truthiness. Prefer `.toBool()`. |
| `array(value)` | Converts a supported value to an array. |
| `object(value)` | Converts a supported value to an object. |
| `min(...values)` | Returns the smallest numeric value. |
| `max(...values)` | Returns the largest numeric value. |
| `clamp(value, low, high)` | Restricts a number to a range. |
| `round(value)`, `floor(value)`, `ceil(value)`, `abs(value)` | Basic numeric operations. |
| `sqrt(value)`, `pow(base, exponent)` | Roots and powers. |
| `sin(value)`, `cos(value)`, `tan(value)` | Trigonometric functions. |
| `random(low, high)` | Returns a random number in the requested range. |
| `range(start, end)` | Creates an inclusive range. The `to` operator is usually clearer. |
| `keys(object)`, `values(object)`, `entries(object)` | Reads object contents. |
| `btoa(value)`, `atob(value)` | Base64 encode and decode. |
| `symbol(name)` | Creates a symbol value. |
| `sleep(seconds)` | Blocks for a duration in seconds. |

## Methods on every value

| Method | Result |
| --- | --- |
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

## Strings

Common string methods include:

```text
append       prepend       insert        delete
contains     containsAny   startsWith    endsWith
index        lastIndex     count         match
replace      replaceFirst  split         left          right
trim         trimText      strip         stripStart    stripEnd
toUpper      toLower       toTitle       toMixed
padStart     padEnd        reverse       repeat
toArr        ord           btoa          atob
encodeHex    decodeHex     encodeBin     decodeBin
hashMD5      hashSHA1      hashSHA256    hashSHA512
```

String positions are 1-based. Indexing and iteration use Unicode code points. `.len` counts UTF-8 bytes, so it may be larger than the number of characters.

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
```

Array positions are 1-based. Mutating methods change the original array. `.clone()` creates an independent deep copy.

## Objects

Common object methods include `getKeys`, `getValues`, `getEntries`, `contains`, `insert`, `delete`, `pick`, `clone`, `toStr`, `jsonParse`, and `getProto`.

Objects return `null` for missing fields. Assignment shares the object; `.clone()` copies it.

## Numbers and booleans

Numbers provide methods such as `round`, `floor`, `ceiling`, `abs`, `sqrt`, `clamp`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `sign`, `isPrime`, and `chr`.

Booleans support the universal conversion, type, assertion, and prototype methods.

## Prototypes

Strings, arrays, objects, numbers, and functions can resolve methods through prototypes. Prefer ordinary functions or named types for application structure. Prototype changes are global to the value type and are harder to trace in a large project.
