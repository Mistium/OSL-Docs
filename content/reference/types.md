---
description: Every built-in type, generics and constraints, conversions between types, typeof, and what the compiler lets you assign.
---

# Types

```osl
int count = 3
number price = 0.5
string name = "Ada"
boolean ready = true
int[] scores = [90, 85]
string[int] stock = {apples: 4}
string? nickname = null
int | string id = "x1"
log count * price name ready scores stock nickname id
```

```output
1.5 Ada true [90,85] {"apples":4} null x1
```


## Built-in types

| Type | Holds | Example |
| --- | --- | --- |
| `int` | whole number, 64 bit | `42` |
| `number` | decimal, 64 bit | `2.5` |
| `int8` `int16` `int32` `int64` | signed whole numbers | `int8 a = 127` |
| `uint` `uint8` `uint16` `uint32` `uint64` | unsigned whole numbers | `uint8 b = 255` |
| `byte` | same as `uint8` | `byte c = 65` |
| `number32` `number64` | floating point | `number32 d = 1.5` |
| `string` | text | `"hi"` |
| `boolean` or `bool` | `true` or `false` | `true` |
| `T[]` | array of `T` | `int[] a = [1, 2]` |
| `T[n]` | fixed-size array | `int[2] p = [1, 2]` |
| `array` | array of anything | `[1, "a"]` |
| `V[K]` or `map<K, V>` | typed map | `string[int] m = {a: 1}` |
| `object` | keys to anything | `{a: 1}` |
| `any` | any value | `any v = 1` |
| `[A, B]` | tuple: fixed positions of different types | `[int, string] t = [1, "a"]` |
| `T?` | `T` or `null` | `int? n = null` |
| `A \| B` | a union | `int \| string u = 1` |
| `def(A, B) R` | function | `def(int) int f = n -> n + 1` |
| `*T` | pointer | `*int p = @n` |
| `result<T, E>` | a value or an error | `"5".tryAs<int>` |
| `option<T>` | `some(x)` or `none()` | `some(3)` |
| `iter<T>` | lazy sequence | `[1, 2].iter()` |
| `unit` | nothing to report | `unit()` |
| `*thread.Thread<T>` | a running async call | `async f() int` |

```osl
int8 a = 127
uint8 b = 255
number32 d = 1.5
byte[] bytes = "hi".toBytes()
int[2] pair = [1, 2]
[int, string] row = [1, "a"]
string[int] m = {a: 1}
map<string, int> m2 = {b: 2}
def(int) int inc = n -> n + 1
result<int, error> parsed = "5".tryAs<int>
option<int> maybe = some(3)
iter<int> it = [1, 2].iter()
log a b d bytes.len pair row m m2 inc(1) parsed.unwrap() maybe.unwrap() it.next().unwrap()
```

```output
127 255 1.5 2 [1,2] [1,"a"] {"a":1} {"b":2} 2 5 3 1
```


`set`, `map`, `canvas`, `xml`, `regex` and `error` are built-in types too; see [Built-in functions](builtins.md#making-collections-and-values).

## Nullable values

`T?` adds `null`. The compiler won't let you use it as a `T` until you have checked, given a fallback or asserted.

```osl
def shout(string? text) string (
  if text == null return "(nothing)"
  return text.toUpper()
)
string? none = null
log shout("hi") shout(none)
log none ?? "fallback"
```

```output
HI (nothing)
fallback
```


```osl error
int? maybe = null
int sure = maybe
```

## Unions and any

A union accepts any of its types. `typeof` narrows it inside the check. `any` holds anything, and gives the compiler nothing to check, so prefer a real type.

```osl
def describe(int | string value) string (
  if typeof(value) == "int" return "int " ++ (value + 1)
  return "string " ++ value.toUpper()
)
log describe(4) describe("ab")
```

```output
int 5 string AB
```


## Typeof

`typeof(x)` gives the type name as text: `int`, `number`, `string`, `boolean`, `array`, `object`, `null`, `function`, `byte`, `option`, `result`, `set`, `map`, or the name of a struct, class or enum. `.getType()` is the method form.

```osl
class Box ( int v = 0 )
def kind(int | string | Box value) string -> typeof(value)
log kind(1) kind("a") kind(Box())
log 2.5.getType() [1].getType() {a: 1}.getType()
```

```output
int string Box
number array object
```


## Const values

`const<T>` makes a binding and its value read-only. Reads work; methods that change the value are rejected. `.clone()` gives a copy you can change.

```osl
const<int[]> primes = [2, 3, 5]
log primes.len primes.sum()
int[] copy = primes.clone()
copy.append(7)
log copy
```

```output
3 10
[2,3,5,7]
```


```osl error
const<int[]> primes = [2, 3, 5]
primes.append(7)
```

## Generics

A type parameter goes in angle brackets after a name. The compiler infers it from the arguments, or you write it: `lastOf<int>(items)`. A constraint before the name limits it: `numeric` (numbers only) or an interface name.

```osl
def lastOf<T>(T[] items) T? (
  if items.len == 0 return null
  return items[-1]
)
def double<numeric T>(T value) T -> value + value
interface Named ( def name() string )
struct Cat ( def name() string -> "Tom" )
def nameOf<Named T>(T item) string -> item.name()
class Box<T> (
  T value
  def init(T value) (
    self.value = value
  )
  def get() T -> self.value
)
Box<int> b = Box<int>(4)
log lastOf([3, 1, 4]) lastOf<string>([]) double(21) double(0.5)
log nameOf(Cat()) b.get()
```

```output
4 null 42 1
Tom 4
```


```osl error
def double<T>(T value) T -> value + value
```

## Conversions

| Form | Does |
| --- | --- |
| `x.as<T>` | converts; text that isn't a number becomes `0` |
| `x.tryAs<T>` | converts into a `result`: an error if it doesn't fit |
| `x.toStr()` | text; arrays and objects become JSON |
| `x.toInt()` | whole number; fractions are cut, bad text is `0` |
| `x.toNum()` | decimal; bad text is `0` |
| `x.toBool()` | `true` only for the text `"true"` |
| `x.toArray()` | an array holding `x`, or `x` if it already is one |
| `x.toObject()` | an object from an object, struct or class |
| `s.toBytes()`, `s.toArr()` | a string as `byte[]`, or as an array of characters |
| `x.<T>` | checks the type at run time (never converts) |
| `x.<T>(fallback)` | the same, giving `fallback` if the type is wrong |

```osl
log "42".as<int> "x".as<int> 3.9.as<int> 65.as<string> 1.as<boolean>
log "42".tryAs<int>.unwrap() "x".tryAs<int>.isErr() 300.tryAs<uint8>.isErr()
log 5.toStr() [1, 2].toStr() {a: 1}.toStr()
log "7.9".toInt() 7.9.toInt() "3.5".toNum() "true".toBool() "yes".toBool()
log "ab".toArr() 5.toArray()
```

```output
42 0 3 65 false
42 true true
5 [1,2] {"a":1}
7 7 3.5 true false
["a","b"] [5]
```


## Assignability

| You write | Result |
| --- | --- |
| `number n = 5` (int to number) | fine |
| `int i = n` where `n` is a `number` | error: use `.as<int>`, `.toInt()` or `.round()` |
| `int i = "5"` | error: convert with `.toInt()` or `.tryAs<int>` |
| `string s = null`, `int j = maybe` | error: `null` needs `T?` |
| `uint8 u = bigInt` | error: use `.as<uint8>` |
| `number[] b = ints` (`int[]` to `number[]`) | error: arrays don't change item type |
| `T` to `T?` | fine |
| a value to a union containing its type | fine |
| a struct or class to an interface it satisfies | fine |
| a literal that fits, such as `int8 x = 100` | fine; `int8 x = 300` is an error |

```osl error
number n = 5.5
int i = n
```

```osl error
int8 x = 300
```
