# Types

Every value in OSL has a type. You usually don't have to think about it - variables can hold any value and the language keeps track for you - but you _can_ annotate variables and function parameters with types, and the compiler will check them.

```javascript
x = 5            // dynamic: x holds a number
int y = 5        // typed: y must always be an integer
```

## The core types

### String

Text, written in double quotes.

```javascript
name = "Hello"
message = "Hello, World!"
path = "C:/Users/Documents"
empty = ""
```

Strings have a large set of [methods](../methods/strings/): `"hi".toUpper()`, `name.len`, `message.split(", ")`, and many more.

### Number

OSL distinguishes **integers** from **floating-point** numbers, which matters when you write type annotations:

```javascript
count = 42          // an integer
price = 19.99       // a floating-point number
total = 10.5 + 20   // 30.5
```

| Annotation | Holds                                                  |
| ---------- | ------------------------------------------------------ |
| `int`      | Whole numbers (also `int8`, `int16`, `int32`, `int64`) |
| `number`   | Floating-point numbers (also `number32`, `number64`)   |

A bare literal like `42` is an `int`; `42.0` is a `number`. If a function expects a `number` and you pass an `int`, convert it with `.toNum()` (or annotate the parameter as `int`).

### Boolean

`true` or `false`.

```javascript
isReady = true
isDone = false

if isReady (
  log "go!"
)

result = true and false   // false
```

### Array

An ordered list, written with square brackets. Arrays can hold values of any type, mixed.

```javascript
numbers = [1, 2, 3]
mixed = [1, "two", true, [4, 5]]
empty = []
```

> **Arrays are 1-indexed.** `numbers[1]` is the first element. Index `0` returns null.

Arrays have many [methods](../methods/arrays/): `numbers.len`, `numbers.map(...)`, `numbers.append(4)`, `numbers.contains(2)`.

### Object

A collection of key-value pairs, written with curly braces. Keys are strings.

```javascript
person = {
  name: "Ada",
  age: 36,
  skills: ["maths", "engines"]
}

log person.name        // Ada
log person["age"]      // 36
```

See [Object Operations](../arrays-and-objects/object-operations.md) for more.

### Null

The absence of a value. Reading a missing object key or an out-of-range array index yields `null`. A function that returns nothing returns `null`.

```javascript
person = { name: "Ada" }
log person.age      // null
```

## Typed declarations

Putting a type before a variable name makes it a _typed_ variable. The compiler then checks every assignment and use:

```javascript
string title = "Docs"
int views = 0
boolean published = false
array tags = ["osl", "guide"]
object meta = { author: "Mist" }

views = "lots"   // compile error: cannot assign string to int
```

`auto` (or `unknown`) means "any type" - the same as leaving a variable untyped:

```javascript
auto anything = 5
anything = "now a string"   // fine
```

See [Typed Variables](typed-variables.md) and [Typed Parameters](../functions-and-classes/typed-parameters.md).

## Type families reference

| Family      | Annotations                                   |
| ----------- | --------------------------------------------- |
| Text        | `string`, `char` (a single character), `byte` |
| Integers    | `int`, `int8`, `int16`, `int32`, `int64`      |
| Floats      | `number`, `number32`, `number64`              |
| Boolean     | `boolean`                                     |
| Collections | `array`, `object`                             |
| Any         | `auto`, `unknown`                             |

There are also **package types** - handles returned by standard-library packages, which you can use as annotations once the package is imported: `map`, `set`, `result`, `canvas`, `xml`, `promise`, `thread`, `regex`, and the struct types a package exposes (for example `*serve.Router`).

## Inspecting and converting types

```javascript
log typeof(42)          // number
log typeof("hi")        // string
log typeof([1, 2])      // array
log typeof({})          // object

log "42".toNum()        // 42   (string → number)
log 42.toStr()          // "42" (number → string)
log 0.toBool()          // false
log value.getType()     // the type name of any value
```
