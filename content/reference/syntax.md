---
description: The lexical structure of OSL and every statement and declaration form, from comments and literals to classes, async functions, test blocks and markup.
---

# Syntax

Every construct in the language, with an example of each. The [course](../learn/index.md) teaches them in order.

```osl
struct Point (
  int x = 0
  int y = 0
)
def describe(Point p) string -> match p.x (
  0 -> "on the axis"
  _ -> "at " ++ p.x ++ "," ++ p.y
)
for n 2 (
  Point p = Point(n - 1, 5)
  log describe(p)
)
```

```output
on the axis
at 1,5
```

## Source files

An OSL program is a file of statements run from the top. A file ends in `.osl`. If it defines `def main()`, that function runs after the top-level code has finished. A file named `something.test.osl` is a test file, run by `osl test`.

```osl
log "top"

def main() (
  log "main"
)
```

```output
top
main
```

## Statements and blocks

- A statement ends at the end of its line. Put several on one line with `;`.
- Brackets continue a line: a call, array or object literal can span lines, and a break after a comma is fine. A line can't end in an operator.
- A **block** is a list of statements in parentheses, `( ... )`. Blocks follow `if`, `for`, `while`, `def`, `class` and the other keywords. A block has its own variables: a name declared inside is gone after the closing bracket.
- `else` may follow the closing bracket on the same line or the next.
- A single statement can follow a header without brackets only for the guard forms `if cond return`, `if cond break` and `if cond continue`.

```osl
log "one"; log "two"
int total = 0
for n 3 (
  int doubled = n * 2
  total += doubled
)
log total
if total > 5 (
  log "big"
)
else (
  log "small"
)
```

```output
one
two
12
big
```

```osl error
if true (
  int inside = 1
)
log inside
```

## Comments

`//` starts a comment that runs to the end of the line. `/* ... */` is a comment that can span lines and sit inside an expression.

```osl
// a line comment
log 1 /* inline */ + 2
/* a comment
   over two lines */
log "done"
```

```output
3
done
```

## Names

A name starts with a letter or `_` and continues with letters, digits and `_`. Names are case-sensitive. Variables and functions conventionally start in lower case, and types in upper case. A name that starts with `_` is private to its class or module, and an unused variable named `_` is ignored. The [reserved words](#reserved-words) can't be used as variable names.

## Number literals

| Form | Example | Type |
| --- | --- | --- |
| whole | `42`, `1_000_000` | `int` |
| decimal | `3.14`, `.5`, `5.` | `number` |
| exponent | `1.5e3`, `1e-7` | `number` |
| hexadecimal | `0xFF` | `int` |
| binary | `0b1010` | `int` |

`_` between digits is ignored. A leading `-` is the negation operator, so a negative literal in a method call needs a bracket: `(-5).abs()`.

```osl
log 42 1_000_000 3.14 .5 1.5e3 1e-7 0xFF 0b1010
log (-5).abs()
```

```output
42 1000000 3.14 0.5 1500 0.0000001 255 10
5
```

## String literals

| Form | Meaning |
| --- | --- |
| `"text"` | a string; escapes work |
| `'text'` | the same; use whichever avoids escaping a quote |
| `` `text ${expr}` `` | a template: every `${...}` runs the expression and inserts its value as text |
| `` $`pattern` `` | a regular expression; backslashes are not escapes |

A string can span lines when written with backticks. In `"` and `'` strings, `\` starts an escape:

| Escape | Is |
| --- | --- |
| `\n`, `\r`, `\t`, `\0` | new line, carriage return, tab, the zero character |
| `\\`, `\"`, `\'`, `` \` ``, `\$` | the character itself |
| `\xNN` | the character with that two-digit hex code |
| `\u{N...}` | the character with that Unicode code point, in 1 to 6 hex digits |

```osl
string name = "Ada"
log "tab:\there" 'say "hi"' "it's"
log "café \x41"
log `Hello ${name.toUpper()}, ${2 + 3} items`
log `first line
second line`
log `cost: \${5}`
log $`\d+`.test("a1")
```

```output
tab:	here say "hi" it's
café A
Hello ADA, 5 items
first line
second line
cost: ${5}
true
```

## Booleans and null

`true` and `false` are booleans. `null` is the absence of a value; only [nullable types](types.md#nullable-values) can hold it. `unit()` is the value of a call that returns nothing useful.

## Array literals

`[1, 2, 3]` is an array; `[]` is an empty one. Items may span lines. `...` spreads another array in. `a to b` makes an array of whole numbers (see [Operators](operators.md#ranges)).

```osl
int[] base = [1, 2, 3]
int[] more = [
  ...base,
  4,
  5
]
log more
log [] [[1, 2], [3]]
```

```output
[1,2,3,4,5]
[] [[1,2],[3]]
```

## Object literals

`{key: value}` is an object. A bare key is literal text, a quoted key can hold anything, and a key in brackets is computed. `{name}` is shorthand for `{name: name}`, and `...` spreads another object in.

```osl
string key = "id"
int age = 36
object o = {name: "Ada", "two words": 1, [key]: 7, age, ...{extra: true}}
log o
```

```output
{"age":36,"extra":true,"id":7,"name":"Ada","two words":1}
```

## Variables

A declaration gives a type, a name and a value: `int count = 0`. `auto` takes the type from the value. A name must be declared before its first use, and a second declaration of the same name in one scope is an error. A declaration always has a value: `int x` on its own is an error.

| Form | Meaning |
| --- | --- |
| `T name = value` | a variable of type `T` |
| `auto name = value` | the type is inferred |
| `T? name = null` | a variable that may also hold `null` |
| `const<T> name = value` | a read-only binding and value; see [Types](types.md#const-values) |
| `[T a, T b] = array` | destructure an array into new variables |
| `auto [a, b] = array` | the same, with inferred types |
| `{a, b} = object` | read keys `a` and `b` of an object into variables |
| `_ = expr` | evaluate `expr` and throw the value away |

```osl
int count = 0
auto label = "items"
string? nickname = null
const<int[]> primes = [2, 3, 5]
[int low, int high] = [1, 9]
auto [first, second] = ["a", "b"]
object point = {x: 3, y: 4}
{x, y} = point
_ = primes.len
count += 2
log count label nickname primes low high first second x y
```

```output
2 items null [2,3,5] 1 9 a b 3 4
```

## if and else

`if` takes a condition and a block. `else if` and `else` follow. There is no `elif` and no `unless`.

`if cond then a else b` is an **expression**: it gives a value, and the branches may be on separate lines. There is no `?:` ternary.

```osl
int temperature = 23
if temperature > 30 (
  log "hot"
) else if temperature > 15 (
  log "warm"
) else (
  log "cold"
)
string size = if temperature > 20 then "big"
  else if temperature > 10 then "medium"
  else "small"
log size
```

```output
warm
big
```

## Loops

| Form | Runs |
| --- | --- |
| `for i n ( ... )` | `n` times, with `i` counting from 1 to `n` |
| `for x in array ( ... )` | once per item |
| `for i, x in array ( ... )` | once per item, with its position `i` |
| `for ch in text ( ... )` | once per character |
| `for k in object ( ... )` | once per key |
| `for k, v in object ( ... )` | once per key and value |
| `for x in a to b ( ... )` | once per whole number from `a` to `b`, both included |
| `for x in iterator ( ... )` | once per value of a [generator](#generators-and-yield) or `iter` |
| `loop n ( ... )` | `n` times, with no counter |
| `while cond ( ... )` | as long as `cond` is true |
| `until cond ( ... )` | until `cond` is true |

`break` leaves the innermost loop, and `continue` skips to its next round. For a loop that runs until something breaks it, use `while true`.

```osl
for i 3 ( log "i" i )
for x in ["a", "b"] ( log x )
for i, x in ["a", "b"] ( log i x )
for ch in "hi" ( log ch )
for k, v in {a: 1} ( log k v )
for year in 2020 to 2022 ( log year )
loop 2 ( log "hello" )
int n = 0
while n < 3 ( n++ )
until n == 0 ( n-- )
log n
for i 10 (
  if i % 2 == 0 continue
  if i > 6 break
  log "odd" i
)
```

```output
i 1
i 2
i 3
a
b
1 a
2 b
h
i
a 1
2020
2021
2022
hello
hello
0
odd 1
odd 3
odd 5
```

## switch

`switch` compares a value with each `case` in turn and runs the first that matches. A case with no statements falls into the next one, so several values can share a block. `default` runs when nothing matched. A case that has statements ends there and doesn't run the next one, so no `break` is needed. On an enum, `case Variant(name)` pulls the data out of a variant, and on a result, `case ok(x)` and `case err(e)` do the same.

```osl
def react(string command) string (
  switch command (
    case "start"
      return "starting"
    case "stop"
    case "quit"
      return "stopping"
    default
      return "unknown"
  )
)
log react("start") react("quit") react("dance")

switch "5".tryAs<int> (
  case ok(n)
    log "number" n
  case err(e)
    log "not a number"
)
```

```output
starting stopping unknown
number 5
```

## match

`match` is an expression: each arm is `pattern -> value`, and the first arm that matches gives the value. A pattern can be a literal, `_` for anything, an enum variant (with names for its data), `ok(x)` or `err(e)` for a result, or a type for a union or `any` value. A `match` must cover every case: add `_`, or list every enum variant. An arm that needs more than a value uses a block, whose `return` gives the arm's value. Used as a statement, its arms run code.

```osl
def label(int code) string -> match code (
  200 -> "ok"
  404 -> "not found"
  _ -> "other"
)
log label(200) label(404) label(500)

enum Shape (
  Circle(number)
  Dot
)
def area(Shape s) number -> match s (
  Shape.Circle(r) -> 3 * r * r
  Shape.Dot -> 0
)
log area(Shape.Circle(2)) area(Shape.Dot)

any value = 3
log match value (
  int -> "an int"
  string -> "a string"
  _ -> "something else"
)
```

```output
ok not found other
12 0
an int
```

```osl error
int code = 404
string label = match code (
  200 -> "ok"
  404 -> "not found"
)
```

## return, break and continue

`return value` leaves a function with a value, and `return` alone leaves it without one. At the top level of a file, `return` ends the program. `break` and `continue` act on the innermost loop. The one-line guards `if cond return`, `if cond break` and `if cond continue` need no block.

```osl
def firstNegative(int[] values) int (
  for v in values (
    if v < 0 return v
  )
  return 0
)
log firstNegative([3, -2, 5]) firstNegative([1])
```

```output
-2 0
```

## Functions

`def name(parameters) returnType ( body )` declares a function. `->` followed by one expression is a one-line body. Omit the return type for a function that returns nothing. Functions can be called before the line that declares them.

| Part | Form | Example |
| --- | --- | --- |
| parameter | `type name` | `int count` |
| default | `type name = value` | `string greeting = "Hello"` |
| optional | `type? name` | `string? title` (`null` when left out) |
| rest | `type ...name` | `number ...values` (an array inside) |
| named argument | `name = value` at the call | `resize(height = 600, width = 800)` |
| spread argument | `...array` at the call | `average(...marks)` |
| several results | return an array, destructure it | `[int lo, int hi] = bounds(xs)` |

```osl
def greet(string name, string greeting = "Hello") string -> greeting ++ ", " ++ name
log greet("Ada")
log greet(greeting = "Hi", name = "Lin")

def average(number ...values) number -> values.sum() / values.len
number[] marks = [70, 80, 90]
log average(2, 4, 9) average(...marks)

def title(string name, string? role) string (
  if role == null return name
  return role ++ " " ++ name
)
log title("Ada") title("Ada", "Dr")

def bounds(int[] xs) int[] -> [xs.min(), xs.max()]
[int lo, int hi] = bounds([4, 9, 2])
log lo hi
```

```output
Hello, Ada
Hi, Lin
5 80
Ada Dr Ada
2 9
```

A call has no space between the name and its bracket: `f(1)` calls, `f (1)` doesn't.

### Generics

`<T>` after a function name declares a type parameter. A constraint goes before the name: `<numeric T>` allows numbers only, and `<Named T>` allows any type that satisfies the interface `Named`. See [Types](types.md#generics).

```osl
def lastOf<T>(T[] items) T? (
  if items.len == 0 return null
  return items[-1]
)
def double<numeric T>(T value) T -> value + value
log lastOf([3, 1, 4]) lastOf<string>([]) double(21) double(0.5)
```

```output
4 null 42 1
```

### Lambdas

A lambda is a function written as a value.

| Form | Example |
| --- | --- |
| untyped, one parameter | `n -> n * 2` |
| typed | `def(int a, int b) int -> a + b` |
| typed, with a block | `def(int n) string -> ( ... )` |
| async, typed | `async(int n) int -> n * 2` |
| async, with a block | `async(string s) string ( ... )` |

A function type is written `def(int, int) int`, and `type Rule = def(string) boolean` gives one a name. A lambda sees the variables around it and keeps them alive.

```osl
auto add = def(int a, int b) int -> a + b
log add(2, 3) [1, 2, 3].map(n -> n * 10)
type Rule = def(string) boolean
Rule short = def(string s) boolean -> s.len <= 4
log short("osl") short("longer")
def makeCounter() def() int (
  int count = 0
  return def() int -> (
    count++
    return count
  )
)
auto next = makeCounter()
log next() next()
```

```output
5 [10,20,30]
true false
1 2
```

### Async functions and lambdas

An `async` function runs its body on a thread of its own when called, and gives back a `*thread.Thread<T>` at once. `.wait()` returns the value (and rethrows an error from the body) and `.then(fn)` runs a function with it. There is no `await`. A file that uses `async` can use `thread` without importing it.

```osl
async slowDouble(int n) int (
  thread.sleep(10)
  return n * 2
)
auto job = slowDouble(21)
log job.wait()
auto triple = async(int n) int -> n * 3
log triple(5).wait()
log slowDouble(2).then(n -> n + 1).wait()
```

```output
42
15
5
```

See the [Concurrency lesson](../learn/concurrency.md) for threads, channels and shared data.

## Pointers

`@name` makes a pointer to a variable, written `*T` in types. Functions that take a pointer can change the variable; `std:ptr` reads and writes through it. For arrays, a pointer supports `.len` and `.delete(position)` directly.

```osl
import "std:ptr"
def bump(*int n) (
  ptr.set(n, ptr.deref(n) + 1)
)
int count = 1
bump(@count)
log count
```

```output
2
```

## Type assertions

`value.<T>` checks at run time that the value has type `T` and gives it as that type, and `value.<T>(fallback)` gives the fallback instead of failing. `.assert(T)` and `.assertElse(T, fallback)` are the long forms. `.as<T>` converts rather than checks, and `.tryAs<T>` converts into a `result`. See [Types](types.md#conversions).

```osl
def describe(int | string value) string (
  string text = value.<string>("not text")
  return text
)
log describe("hi") describe(5)
```

```output
hi not text
```

## throw and try

`throw value` raises an error. A string is turned into an error, and `error(kind, message)` makes one with a kind. An uncaught throw prints the error and exits with a failure status.

A call that returns a `result` is handled with `catch`, `switch`, `!`, `.unwrap()` or `.unwrapOr(x)`:

| Form | Does |
| --- | --- |
| `value catch ( ... )` | on an error, runs the block; the block ends with `return`, `continue`, `break` or `throw` |
| `value catch (e) ( ... )` | the same, naming the error `e` |
| `value catch return` | the same, with a single statement and no block |
| `value!` | on an error, returns it from the current function, which must return a `result` |
| `try(expression)` | turns a throw inside the expression into an `err` result |
| `try(( statements ))` | the same for a block of statements |

```osl
import "std:result"

def parse(string text) result<int, error> -> text.tryAs<int>

def total(string a, string b) result<int, error> (
  int x = parse(a)!
  int y = parse(b)!
  return result.ok(x + y)
)
log total("2", "3").unwrap() total("2", "x").isErr()

def readOrZero(string text) int (
  int n = parse(text) catch (e) (
    log "bad:" text
    return 0
  )
  return n
)
log readOrZero("7") readOrZero("seven")

def check(int n) int (
  if n < 0 throw error("RangeError", "negative")
  return n
)
auto attempt = try(check(-1))
log attempt.isErr() attempt.unwrapErr().kind
```

```output
5 true
bad: seven
7 0
true RangeError
```

## defer

`defer statement` runs the statement when the function ends, however it ends. Several defers run in reverse order.

```osl
def work() int (
  defer log "closing 1"
  defer log "closing 2"
  log "working"
  return 7
)
log work()
```

```output
working
closing 2
closing 1
7
```

## atomic

`atomic ( ... )` runs the block as one step, so no other thread can act between its statements. Each single statement on shared data is already atomic; use `atomic` when several must happen together.

```osl
int balance = 100
int log_count = 0
atomic (
  balance -= 30
  log_count++
)
log balance log_count
```

```output
70 1
```

## Structs

A struct is a value with named, typed fields that all have defaults. Creating one takes fields in order, by name, or as an object literal. Assigning a struct copies it. Methods are `def`s inside, and `self` is the struct. Structs compare by contents.

```osl
struct Point (
  int x = 0
  int y = 0
  def length2() int -> (self.x * self.x) + (self.y * self.y)
)
Point a = Point(3, 4)
Point b = Point(y = 9)
Point c = Point{x: 1, y: 2}
Point d = a
d.x = 99
log a.x d.x b.y c.y a.length2()
log Point(1, 2) == Point(1, 2)
auto size = struct(w = 640, h = 480)
log size.w
```

```output
3 99 9 2 25
true
640
```

## Classes

A class is like a struct, except that instances are shared when assigned. `def init(...)` is the constructor, `self` is the instance, `static def` declares a method on the class, `extends` inherits fields and methods, and a field or method starting with `_` is private. A class can define the operators `+ - * / % ^ == <=>` and the unary `-` as methods, and a subclass can override methods.

```osl
class Animal (
  string name = ""
  def init(string name) (
    self.name = name
  )
  def sound() string -> "..."
  def speak() string -> self.name ++ " says " ++ self.sound()
  static def named(string name) Animal -> Animal(name)
)
class Dog extends Animal (
  def sound() string -> "woof"
)
Animal[] pets = [Dog("Rex"), Animal.named("Rock")]
for pet in pets ( log pet.speak() )

class Vec (
  int x = 0
  def init(int x) (
    self.x = x
  )
  def +(Vec other) Vec -> Vec(self.x + other.x)
  def -() Vec -> Vec(-self.x)
  def ==(Vec other) boolean -> self.x == other.x
  def <=>(Vec other) int -> self.x - other.x
)
log (Vec(1) + Vec(2)).x (-Vec(5)).x Vec(1) == Vec(1) Vec(1) < Vec(2)
```

```output
Rex says woof
Rock says ...
3 -5 true true
```

A class can take type parameters, as in `class Box<T> ( T value )`, and is used as `Box<int>(1)`.

## Enums

An enum is a closed set of cases. A case may carry data. `match` must cover every case.

```osl
enum Light (
  Red
  Amber
  Green
)
enum Load (
  Waiting
  Done(string)
)
Light now = Light.Red
log now == Light.Red now == Light.Green
Load state = Load.Done("hello")
log match state (
  Load.Waiting -> "waiting"
  Load.Done(text) -> "got " ++ text
)
```

```output
true false
got hello
```

## Interfaces

An interface lists method signatures. Any struct or class with matching methods satisfies it; there is no `implements`. An interface can be used as a type for parameters, variables and arrays, and as a generic constraint.

```osl
interface Shape (
  def area() number
)
struct Square (
  number side = 1
  def area() number -> self.side * self.side
)
class Circle (
  number r = 1
  def area() number -> 3 * self.r * self.r
)
Shape[] shapes = [Square(2), Circle(1)]
for s in shapes ( log s.area() )
```

```output
4
3
```

## Type aliases

`type Name = ...` names a type. It can name a union, an array, a function type or any other type.

```osl
type Id = string | int
type Grid = int[][]
type Rule = def(string) boolean
Id a = "x1"
Id b = 7
Grid g = [[1, 2], [3, 4]]
log a b g[2][1]
```

```output
x1 7 3
```

## Modules

| Form | Does |
| --- | --- |
| `import "./file.osl"` | loads a file and makes everything it exposes available by name |
| `import "./folder"` | loads every `.osl` file in the folder, in alphabetical order |
| `import {a, b as c} from "./file.osl"` | takes only those names, optionally renamed |
| `import * as ns from "./file.osl"` | puts everything under the prefix `ns.` |
| `import "std:json"` | a standard package, used as `json.parse(...)` |
| `import "go:strings"` | a Go package, used as `strings.Repeat(...)` |
| `export {a, b}` | exposes only those names; everything else stays private to the file |

Without an `export` line, a file exposes everything it declares. `export` takes a list of names, not a declaration. See [Modules](../learn/modules.md).

```osl file=main.osl
import {double as twice} from "./util.osl"
import * as util from "./util.osl"
log twice(4) util.double(5)
```

```osl file=util.osl
def double(int n) int -> n * 2
def hidden() int -> 1
export {double}
```

```output
8 10
```

## Test blocks

`test ( ... )` at the top level holds checks: every boolean line in it must be true. Test blocks run with `osl test` and are left out of `osl run` and `osl compile`. See [Testing](testing.md).

```osl norun
def double(int n) int -> n * 2
test (
  double(2) == 4
  double(0) == 0
)
```

## Generators and yield

A function that returns `iter<T>` and uses `yield` is a generator. It produces its values one at a time, on demand, so it can be endless. A bare `return` ends it.

```osl
def countdown(int from) iter<int> (
  int n = from
  while n > 0 (
    yield n
    n--
  )
)
for n in countdown(3) ( log n )
log countdown(10).filter(n -> n % 2 == 0).take(2).toArray()
```

```output
3
2
1
[10,8]
```

## Markup tags

With `import "std:ui"`, a function can return a tree of tags written like HTML. A tag is `<name attribute=value>`, containers hold statements and child tags, and `${...}` holes put any expression into text or an attribute. Attribute values without spaces are written as they are, and values with spaces go in parentheses. The tags are `column`, `row`, `stack`, `grid`, `scroll`, `box` and `absolute` (containers), `text`, `button` and `link` (text), and `input`, `checkbox`, `image` and `spacer` (self-closing). The full list of attributes and how layout works is in [layout](../packages/layout.md).

```osl norun
import "std:ui"

def Counter(string label, int count) ui.node (
  return <column pad=10 gap=4>
    <text>${label}: ${count}</text>
    <row gap=4>
      for n 3 (
        <button>+${n}</button>
      )
    </row>
  </column>
)
```

## Reserved words

These can't be used as variable, parameter or function names.

| Kind | Words |
| --- | --- |
| statements | `if` `else` `for` `while` `until` `loop` `switch` `case` `default` `break` `continue` `return` `defer` `throw` `yield` `import` `export` |
| declarations | `def` `class` `struct` `enum` `interface` |
| operators written as words | `and` `or` `xor` `nand` `nor` `xnor` `in` `to` `is` |
| types | `int` `int8` `int16` `int32` `int64` `uint` `uint8` `uint16` `uint32` `uint64` `byte` `char` `number` `number32` `number64` `string` `boolean` `bool` `object` `array` `any` `auto` `void` `null` `map` `set` `result` `option` `error` `unit` `canvas` `xml` `channel` `thread` `iter` `promise` `regex` |
| values | `true` `false` |

Other words have a meaning only where they are used: `match`, `try`, `catch`, `async`, `atomic`, `type`, `test`, `extends`, `static`, `self`, `log`, `say`, `warn`, `wait` and `exit`. They can be used as variable names, but it is clearer not to.
