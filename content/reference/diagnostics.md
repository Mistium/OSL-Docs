---
description: Every error and warning the OSL compiler reports and every error kind a running program can throw, with what triggers each one and how to fix it.
---

# Diagnostics

A diagnostic is a message from the compiler about your code. Errors stop the build. Warnings point at code that compiles but is probably wrong, risky or hard to read. A third family, runtime errors, is not a diagnostic at all: it is what a running program throws, and what your code catches. This page lists all three, so you can look up a message by its name.

## Reading a diagnostic

Every diagnostic has a kind, a message and a place:

```text
main.osl:2:9: osl: TypeError: Cannot store a string in int; convert it with .toInt(), which gives 0 for text that isn't a number, or with .tryAs<int>() to get a result you can check

   |
 2 | int n = "hello"
   |         ^^^^^^^
```

- The **kind** ends in `Error` or `Warning`, and says what sort of problem it is.
- The **place** is `file:line:column`, and the carets underline the code concerned.
- A warning may add **notes**, and related places such as where a value was declared.
- Every warning also has a **code** such as `OSL-UNUSED-VARIABLE`. It does not appear in the message. You use it to [silence](editor.md#silencing-a-warning) or [reconfigure](opal.md#lint-settings) the warning.

Errors make `osl run`, `osl compile` and `osl test` fail with status 1 and build nothing. Warnings are printed, and the program still builds. A command prints at most 20 warnings and counts the rest, unless you pass `--all-warnings`. `osl lsp check` prints all of them.

A project can promote a warning to an error in `opal.json`. The warning's kind then changes its ending: an `UnusedVariableWarning` becomes an `UnusedVariableError`, with a note that says the project made it one.

The examples below that show errors are marked as failing on purpose, so the site displays the diagnostic the compiler gave. The warning examples compile, and show their warning.

## Compile errors

| Kind | Raised when |
| --- | --- |
| [`SyntaxError`](#syntaxerror) | The code is not valid OSL. |
| [`TypeError`](#typeerror) | A value does not have the type the code needs, or something is called that does not exist. |
| [`ReferenceError`](#referenceerror) | A name is not defined, not visible, or used before its declaration runs. |
| [`ImportError`](#importerror) | An import cannot be found, read or used. |
| [`ExportError`](#exporterror) | A module exports something it does not declare. |
| [`IndexError`](#indexerror) | A constant index is outside the array, string or tuple. |
| [`MathError`](#matherror-overflowerror-and-shifterror) | A constant division by zero. |
| [`OverflowError`](#matherror-overflowerror-and-shifterror) | A constant integer calculation overflows. |
| [`ShiftError`](#matherror-overflowerror-and-shifterror) | A shift by a negative constant. |
| [`ConcurrencyError`](#concurrencyerror) | An `atomic` block does something that could deadlock. |
| [`ConfigError`](#configerror) | The `lint` section of `opal.json` is invalid. |
| `RecursionError` | A function calls itself without end, and the stack ran out. Add a base case. |
| `BuildError` | The compiler produced Go code that Go could not build. Report it, with the program, as a bug. |
| `InternalError` | The compiler used one of its own helpers without including it. Also a compiler bug. |

### SyntaxError

The code does not parse. The message says what the compiler expected, and often the fix.

```osl error
log "a", "b"
```

Values after `log` are separated by spaces, not commas. Other common causes:

- A block opened with `(` and never closed with `)`.
- An operator with nothing on one side, such as `log 1 +`.
- A string that is not closed.
- A variable used without being declared (`name = "a"` instead of `string name = "a"`).
- A function body written after `->` that is more than one value. Wrap statements in a block: `def f() -> ( ... )`.
- `export` written before a declaration. Declare the name, then write `export { name }`.

### TypeError

By far the most common error. It covers a value of the wrong type, a call with the wrong arguments, an unknown method, writing to a `const`, and reading a private field.

```osl error
int n = "hello"
log n
```

The message names both types and suggests the conversion. Fix it by converting (`.toInt()` gives 0 for text that is not a number, `.tryAs<int>()` gives a [result](../learn/errors.md) you can check), or by declaring the right type.

Other `TypeError` messages, and what to do:

| Message starts | Cause | Fix |
| --- | --- | --- |
| `Argument 2 to add expects int, got string` | A call passes the wrong type. | Convert the argument. |
| `Too many arguments in call to f` | A call passes more than the function takes. | Remove the extra argument. |
| `Unknown method 'nothing' on string` | No such method for that type. | Check the name against the type's methods. |
| `Cannot reassign const variable 'k'` | A `const` is assigned a second time. | Declare it without `const`, or compute a new variable. |
| `'_n' is a private field of Counter` | A name starting with `_` is read from outside its type. | Add a method that returns it. |
| `Cannot assign nullable type int? to non-nullable variable of type int` | A value that may be `null` is stored where `null` is not allowed. | Narrow it with `.<int>` or `.<int>(fallback)`, or check for `null` first. |
| `Cannot access property 'length' on array; did you mean .len?` | An old or foreign name. | Use the name the message suggests. |
| `Cannot use 200 as int8` | A constant does not fit the type. | Use a wider type. |

### ReferenceError

A name that is not defined at that point.

```osl error
log missing
```

It also happens when a variable is declared inside a block and used outside it:

```osl error
int limit = 3
if limit > 1 (
  int inner = 1
  log inner
)
log inner
```

Declare the variable before the block and assign it inside. A third form reports a top-level variable that is read before the line that declares it has run:

```osl error
log later
int later = 1
```

Move the declaration above its first use. A message that ends `add import "std:thread"` means the name belongs to a standard package you have not imported.

### ImportError

An `import` the compiler cannot satisfy.

```osl error
import "std:nothing"
```

The message may suggest a nearby package name (`Did you mean 'std:fs'?`), or say that a feature is built in: strings, arrays and the maths functions need no import. `osl package` lists the real names. Other causes:

- A local file that does not exist, or cannot be read.
- A path that climbs out of the project folder (`local import escapes project root`).
- Two imports that bind the same name.
- Two packages that cannot be used in one program because they define the same name.
- Importing a Go package without the `go:` prefix.

A second file shows two more:

```osl error file=main.osl
import {b} from "./lib.osl"
log b
```

```osl file=lib.osl
int a = 1
int b = 2
export { a }
```

`lib.osl` exports only `a`, so importing `b` fails with `module does not export 'b'`. A private name is reported as `'b' is private to its module`.

### ExportError

An `export { ... }` list that names something the file does not declare, or names the same thing twice.

```osl error file=main.osl
import "./lib.osl"
log a
```

```osl file=lib.osl
int a = 1
export { a, missing }
```

The error points into `lib.osl`: `exported name 'missing' is not declared`. Declare the name, or take it out of the list.

### IndexError

OSL counts from 1. A constant index of 0 is always a mistake, and the compiler says so before the program runs. The same error covers a constant tuple index or array assignment outside the bounds.

```osl error
string[] items = ["a", "b"]
log items[0]
```

Use `items[1]` for the first item and `items[-1]` for the last. An index that is not a constant, and is out of range at run time, does not stop the program: reading it gives `null`.

### MathError, OverflowError and ShiftError

Errors found by calculating with constants while compiling:

```osl error
log 10 / 0
```

```osl error
int big = 9223372036854775807 + 1
log big
```

```osl error
log 1 << -1
```

`MathError` covers dividing by zero and remainders with zero. `OverflowError` covers a constant integer calculation that does not fit in an `int` (addition, negation, `abs`, a left shift). `ShiftError` is a shift count that is negative. A zero divisor that is only known at run time is not an error: dividing a number by zero gives infinity.

### ConcurrencyError

An `atomic` block takes the locks for every shared value it reaches before it runs, so it must not run other OSL code that could wait on those locks. The compiler rejects calling functions, creating functions, passing callbacks, and declaring things inside the block.

```osl error
int n = 0
def one() int -> 1
atomic (
  n = n + one()
)
log n
```

Call the function before the block and use its result inside, or after it.

### ConfigError

A problem in `opal.json`, reported at its place in that file: an unknown lint code, a bad severity, or a bad option. It cannot be silenced, because it is in the configuration rather than in the code.

```text
opal.json:1:102: osl: ConfigError: unknown lint rule "OSL-BOGUS" in lint.rules
```

## Warnings

Warnings are grouped here by what they are about. Each group lists the kind, the code, what triggers it and how to fix it, with an example that shows the warning. The full list of codes is in the [table at the end](#all-warning-codes).

### Unused code

`UnusedVariableWarning` (`OSL-UNUSED-VARIABLE`) is reported for a variable, loop variable or loop index that is declared and never read. Name it `_`, or start the name with an underscore, to say it is unused on purpose.

```osl norun
int count = 3
```

```osl norun
for i in 1 to 3 (
  log "hello"
)
```

For the loop, use `for _ in 1 to 3`. Unused function parameters are not reported.

`UnusedValueWarning` (`OSL-UNUSED-VALUE`) is reported for a value on a line of its own that does nothing. Remove it, or write `void` before it to drop the value on purpose. `osl fix` adds the `void`.

```osl norun
int a = 1
a + 1
log a
```

`UnusedImportWarning` (`OSL-UNUSED-IMPORT`) is reported for a `go:` import that nothing uses. Remove the line.

```osl norun
import "go:strings"
log "no strings used"
```

### Failure that nobody handles

`ThrowWarning` (`OSL-UNHANDLED-THROW`) is reported when a call that can fail is used as a plain value, so a failure would crash the program. The message names the condition that would make the call safe, lists the call chain, and names the error kinds the call can fail with.

```osl norun
import "std:fs"

string text = fs.readFile("data.txt")
log text
```

Handle the result with `catch`, `switch` or `!`, keep it as a `result`, or `unwrap()` it on purpose. A guard also removes the warning: after `if !fs.isFile(path) return`, the compiler knows `fs.readFile(path)` will not fail for that reason. See [Errors](../learn/errors.md).

```osl norun
import "std:fs"

def load() string (
  string text = fs.readFile("data.txt") catch (e) (
    return "could not read: " ++ e.kind
  )
  return text
)

log load()
```

Explicit `unwrap`, `unwrapErr`, `expect`, `throw` and postfix `!` do not warn, because they are decisions.

### Types and assertions

`TypeWarning` (`OSL-TYPEOF-KNOWN`, `OSL-TYPEOF-NULLABLE`) is reported when `typeof` is asked about a value whose type the compiler already knows. `typeof` is for values that can be more than one type. Use the type directly, or compare with `null` for an optional value.

```osl norun
int a = 1
log typeof(a)
```

`AssertionWarning` is reported for `.<T>` assertions that do nothing or cannot work:

| Code | Reported when | Fix |
| --- | --- | --- |
| `OSL-REDUNDANT-ASSERT` | The value is already known to be `T`. | Remove the assertion. `osl fix` does. |
| `OSL-KNOWN-ASSERT-ELSE` | `.<T>(fallback)` is applied to a type that is never `T`, so it always gives the fallback. | Convert with `.as<T>` instead. |
| `OSL-CHAINED-ASSERT` | Two assertions in a row. | Assert once, against the final type. |
| `OSL-NARROWING-ASSERT` | A known type is asserted as another, which can hide invalid values. | Convert explicitly, or validate first. |

```osl norun
int a = 1
log a.<int>
```

`ConversionWarning` (`OSL-NEEDLESS-TRYAS`) is reported for `.tryAs<T>()` on a value that already is `T` and so cannot fail. Use the value as it is.

```osl norun
int a = 1
log a.tryAs<int>().unwrap()
```

`BoundaryWarning` is about `any` and `unknown`, which hide where input should be checked:

| Code | Reported when |
| --- | --- |
| `OSL-LOOSE-PARAM` | A function declares an `any` parameter. |
| `OSL-LOOSE-RETURN` | A function returns `any`. |
| `OSL-LOOSE-ALIAS` | A type alias is `any`, or hides a loose parameter or return. |
| `OSL-LOOSE-DICTIONARY` | A dictionary type has `any` values. |
| `OSL-WIDENED-VALUE` | A known value is stored as `any` and narrowed again with `.<T>`. |
| `OSL-REFLECT-IMPORT` | The program imports `go:reflect`. |

```osl norun
def show(any value) (
  log value
)

show(1)
```

Declare the real type, or decode unknown input at the edge of your program: a parameter whose first use is a `typeof` check or a schema `parse`/`isValid` is treated as that edge and does not warn. A function whose job is to take anything, like a logger, can silence the warning with a comment.

`NullableWarning` (`OSL-NULLABLE-UNION`) is reported for a union that lists `null` as a member. Write it with the `?` suffix.

```osl norun
(string | null) name = "a"
log name
```

`SafetyWarning` (`OSL-RAW-WITHOUT-COMMENT`) is reported for a `raw()` call, which emits Go verbatim and skips every check, when no `//` comment above it says why it is needed.

### Conditions and comparisons

`ConditionWarning` (`OSL-CONSTANT-CONDITION`) is reported for an `if` or `while` whose condition is always the same, and for a comparison of two strings known at compile time. Remove the `if`, or use a variable.

```osl norun
int x = 3
if true (
  log x
)
```

`ComparisonWarning` covers comparisons that probably do not mean what they say:

| Code | Reported when | Fix |
| --- | --- | --- |
| `OSL-SELF-COMPARISON` | A value is compared with itself. NaN is the one value unequal to itself, so use `math.isNan` to test for it. | Compare the intended operands. |
| `OSL-MIXED-KIND-EQUALITY` | `==` compares different kinds, such as an `int` and a `string`, which compares their text. | Convert one side, with `.toStr()` or `.tryAs<int>()`. |
| `OSL-POINTER-EQUALITY` | `==` on two handles, which compares their contents. | Use `===` to compare identity. |

```osl norun
int a = 1
string s = "1"
log a == s
```

`NegationWarning` (`OSL-DOUBLE-NEGATION`) is reported for `!!value`. Use the value, or `.toBool()` to convert it.

`PrecedenceWarning` (`OSL-MIXED-OPERATORS`, `OSL-MIXED-LOGICAL-OPERATORS`) is reported when different arithmetic operators, or different logical operators, appear together without parentheses. OSL evaluates arithmetic strictly left to right, so `a + b * c` is `(a + b) * c`. Add parentheses to show which you mean.

```osl norun
int a = 1
int b = 2
int c = 3
log a + b * c
```

`AssignmentWarning` (`OSL-SELF-ASSIGNMENT`) is reported for `a = a`. Remove it.

### Readability

`ReadabilityWarning` is reported for code that has a simpler equivalent. Most carry an exact replacement, so the editor offers it as a quick fix and `osl fix` applies it.

| Code | Pattern | Write instead |
| --- | --- | --- |
| `OSL-NEGATED-EQUALITY` | `!(a == b)` | `a != b` |
| `OSL-REDUNDANT-TERNARY` | `if ready then true else false` | `ready` |
| `OSL-LEGACY-TERNARY` | `ready ? "go" "wait"` | `if ready then "go" else "wait"` |
| `OSL-NESTED-TERNARY` | A conditional inside another conditional | An `else if` chain, or `match` |
| `OSL-REDUNDANT-COALESCE` | `value ?? null` | `value` |
| `OSL-PREFIX-STRIP` | `if s.startsWith(p) ( s = s.replace(p, "") )` | `s.stripStart(p)` |
| `OSL-TUPLE-UNION` | `([string] \| [int])[]` | `[string \| int][]` |

```osl norun
int a = 1
log !(a == 2)
```

```osl norun
boolean ok = true
log ok ? "yes" "no"
```

`BranchWarning` is reported for an `if` that says less than it could:

| Code | Reported when | Fix |
| --- | --- | --- |
| `OSL-BOOLEAN-BRANCHES` | The branches only `return true` and `return false`. | Return the condition. |
| `OSL-IDENTICAL-BRANCHES` | Two branches run the same code. | Merge them, or drop the condition. |
| `OSL-INVERTED-CONDITION` | An `if` is followed by an `if` on the negated condition. | Use `else`. |

```osl norun
def isBig(int n) boolean (
  if n > 10 ( return true ) else ( return false )
)

log isBig(3)
```

`RedundantWarning` (`OSL-REDUNDANT-CALL`) is reported for a call with no effect, such as `.iter()` on an iterator. Remove it.

`MethodWarning` is reported for a method call that does something other than it seems:

- `OSL-STRING-TO-ARRAY`: `toArray()` on a string gives an array holding the string. Use `.toArr()` for its characters.
- `OSL-OBJECT-MEMBER-CALL`: objects have no method of that name, so the call reads the object's member of that name. The message names the method you probably meant.

```osl norun
log "abc".toArray()
```

### Changing values

`Warning` (`OSL-DELETE-IN-PLACE`) is reported when the result of `delete` on an array or object is stored under a second name. `delete` changes the value in place and returns it, so both names now point at the same changed value. Use `array.clone().delete(...)` or `object.omit(...)` for a changed copy.

```osl norun
int[] a = [1, 2, 3]
int[] b = a.delete(1)
log a b
```

`StructWarning` (`OSL-LOST-STRUCT-CHANGE`) is reported when code changes a copy of a struct that it then throws away: a function that modifies its own copy of a struct parameter, or a loop that modifies the loop's copy of an item. Take a pointer, return the changed value, change the item by index, or make the type a class.

```osl norun
struct Point (
  int x = 0
)

Point[] points = [Point(1)]
for p in points (
  p.x = 5
)
log points[1].x
```

`StructCopyNote` (`OSL-STRUCT-COPY`) is a note rather than a warning. It marks code where a type that used to be shared became a struct, so assignment now copies. Check that a copy is what the code needs.

### Concurrency and cleanup

`ConcurrencyWarning` has two codes:

- `OSL-ATOMIC-BLOCKING`: a call inside an `atomic` block waits (sleeping, reading input, waiting on a thread) while holding the block's locks, so every thread that needs those values waits too. Do the slow thing before or after the block.
- `OSL-CONCURRENCY-FOREIGN-ESCAPE`: a shared OSL array or object is passed to a Go package function. Go code can keep the pointer or start its own goroutines, outside OSL's automatic locking. Copy the data first, or keep the synchronisation inside the Go call.

```osl norun
import "go:slices"

int[] nums = [3, 1, 2]
slices.Sort(nums)
log nums
```

`DeferWarning` (`OSL-DEFER-IN-LOOP`) is reported for a `defer` inside a loop. A `defer` runs when its function (or the program) ends, not at the end of each loop pass. Move the loop body into a function and call it from the loop.

```osl norun
for i in 1 to 3 (
  defer log i
)
```

### Deprecation

`DeprecationWarning` (`OSL-DEPRECATED`, `OSL-DEPRECATED-IMPORT`) is reported for a function, method, option, constant or import that still works but has a replacement. The message names the replacement. `osl/name` imports are the old spelling of `std:name`.

```osl norun
import "std:fs"

log fs.getBase("docs/page.md")
```

Each package page marks its deprecated members, and the [API reference](../packages/index.md) says what replaces them.

### Pedantic and opt-in rules

`OSL-IMPLICIT-NARROW` is pedantic: it is reported only with `--all-warnings`, or when a project sets it to `warning`. Four more rules are off until a project turns them on in `opal.json`, and report as these kinds: `OSL-COMMENT` as `CommentWarning`, `OSL-LONG-FUNCTION` as `LengthWarning`, `OSL-UNTYPED-GLOBAL` as `TypeWarning`, and `OSL-OBJECT-PARAM` as `BoundaryWarning`. See [Lint settings](opal.md#opt-in-rules).

### All warning codes

| Code | Kind | Group |
| --- | --- | --- |
| `OSL-ATOMIC-BLOCKING` | `ConcurrencyWarning` | Concurrency |
| `OSL-BOOLEAN-BRANCHES` | `BranchWarning` | Readability |
| `OSL-CHAINED-ASSERT` | `AssertionWarning` | Types |
| `OSL-COMMENT` (opt in) | `CommentWarning` | Opt in |
| `OSL-CONCURRENCY-FOREIGN-ESCAPE` | `ConcurrencyWarning` | Concurrency |
| `OSL-CONSTANT-CONDITION` | `ConditionWarning` | Conditions |
| `OSL-DEFER-IN-LOOP` | `DeferWarning` | Concurrency |
| `OSL-DELETE-IN-PLACE` | `Warning` | Values |
| `OSL-DEPRECATED` | `DeprecationWarning` | Deprecation |
| `OSL-DEPRECATED-IMPORT` | `DeprecationWarning` | Deprecation |
| `OSL-DOUBLE-NEGATION` | `NegationWarning` | Conditions |
| `OSL-IDENTICAL-BRANCHES` | `BranchWarning` | Readability |
| `OSL-IMPLICIT-NARROW` (pedantic) | `Warning` | Types |
| `OSL-INVERTED-CONDITION` | `BranchWarning` | Readability |
| `OSL-KNOWN-ASSERT-ELSE` | `AssertionWarning` | Types |
| `OSL-LEGACY-TERNARY` | `ReadabilityWarning` | Readability |
| `OSL-LONG-FUNCTION` (opt in) | `LengthWarning` | Opt in |
| `OSL-LOOSE-ALIAS` | `BoundaryWarning` | Types |
| `OSL-LOOSE-DICTIONARY` | `BoundaryWarning` | Types |
| `OSL-LOOSE-PARAM` | `BoundaryWarning` | Types |
| `OSL-LOOSE-RETURN` | `BoundaryWarning` | Types |
| `OSL-LOST-STRUCT-CHANGE` | `StructWarning` | Values |
| `OSL-MIXED-KIND-EQUALITY` | `ComparisonWarning` | Conditions |
| `OSL-MIXED-LOGICAL-OPERATORS` | `PrecedenceWarning` | Conditions |
| `OSL-MIXED-OPERATORS` | `PrecedenceWarning` | Conditions |
| `OSL-NARROWING-ASSERT` | `AssertionWarning` | Types |
| `OSL-NEEDLESS-TRYAS` | `ConversionWarning` | Types |
| `OSL-NEGATED-EQUALITY` | `ReadabilityWarning` | Readability |
| `OSL-NESTED-TERNARY` | `ReadabilityWarning` | Readability |
| `OSL-NULLABLE-UNION` | `NullableWarning` | Types |
| `OSL-OBJECT-MEMBER-CALL` | `MethodWarning` | Readability |
| `OSL-OBJECT-PARAM` (opt in) | `BoundaryWarning` | Opt in |
| `OSL-POINTER-EQUALITY` | `ComparisonWarning` | Conditions |
| `OSL-PREFIX-STRIP` | `ReadabilityWarning` | Readability |
| `OSL-RAW-WITHOUT-COMMENT` | `SafetyWarning` | Types |
| `OSL-REDUNDANT-ASSERT` | `AssertionWarning` | Types |
| `OSL-REDUNDANT-CALL` | `RedundantWarning` | Readability |
| `OSL-REDUNDANT-COALESCE` | `ReadabilityWarning` | Readability |
| `OSL-REDUNDANT-TERNARY` | `ReadabilityWarning` | Readability |
| `OSL-REFLECT-IMPORT` | `BoundaryWarning` | Types |
| `OSL-SELF-ASSIGNMENT` | `AssignmentWarning` | Conditions |
| `OSL-SELF-COMPARISON` | `ComparisonWarning` | Conditions |
| `OSL-STRING-TO-ARRAY` | `MethodWarning` | Readability |
| `OSL-STRUCT-COPY` | `StructCopyNote` | Values |
| `OSL-TUPLE-UNION` | `ReadabilityWarning` | Readability |
| `OSL-TYPEOF-KNOWN` | `TypeWarning` | Types |
| `OSL-TYPEOF-NULLABLE` | `TypeWarning` | Types |
| `OSL-UNHANDLED-THROW` | `ThrowWarning` | Failure |
| `OSL-UNTYPED-GLOBAL` (opt in) | `TypeWarning` | Opt in |
| `OSL-UNUSED-IMPORT` | `UnusedImportWarning` | Unused code |
| `OSL-UNUSED-VALUE` | `UnusedValueWarning` | Unused code |
| `OSL-UNUSED-VARIABLE` | `UnusedVariableWarning` | Unused code |
| `OSL-WIDENED-VALUE` | `BoundaryWarning` | Types |

The compile errors have codes too (`OSL-SYNTAX`, `OSL-TYPE`, `OSL-IMPORT`, `OSL-REFERENCE`, `OSL-ZERO-INDEX`, `OSL-COMPILE`), but a project cannot change them: only warnings are configurable.

## Runtime errors

A compile error stops the build. A runtime error is thrown while the program runs. It carries a `kind` and a `message`, and the program catches it with `catch`, `try` or a `result`. If nothing catches it, the program prints the error with the line it came from and exits with status 1.

```osl
import "std:fs"
import "std:json"

auto missing = fs.readFile("missing.txt")
auto notFile = fs.readFile(".")
auto bad = json.parse<int[]>("not json")
auto count = "abc".tryAs<int>()
log missing.unwrapErr().kind
log notFile.unwrapErr().kind
log bad.unwrapErr().kind
log count.unwrapErr().kind
log missing.unwrapErr().message
log bad.unwrapErr().message
```

```output
NotFoundError
IOError
ParseError
ParseError
fs.readFile: open missing.txt: no such file or directory
json.parse: line 1, column 1: expected a value, got not
```

The message starts with the function that failed. The kind is the part to test, because it stays the same when the wording changes:

```osl
import "std:fs"

fs.readFile("missing.txt") catch (e) (
  log "caught " ++ e.kind
)
```

```output
caught NotFoundError
```

Your own code throws an error with `throw error("Kind: message")`. Text that starts with a kind and a colon takes that kind, and plain text becomes a `RuntimeError`:

```osl
def setSize(int size) (
  if size <= 0 (
    throw error("ValueError: size must be positive")
  )
)

auto r = try(setSize(0))
log r.unwrapErr().kind
log r.unwrapErr().message
```

```output
ValueError
size must be positive
```

### Kinds

These are the kinds the standard packages throw, and the Go errors they translate. A package function's documentation names the kinds it can fail with.

| Kind | Meaning | Typical cause |
| --- | --- | --- |
| `NotFoundError` | Something that was asked for does not exist. | A missing file or folder, an unknown key. |
| `PermissionError` | The operating system refused. | Reading a file you may not read. |
| `IOError` | Reading or writing failed for another reason. | A path that is a folder, a closed pipe, end of input. |
| `ParseError` | Text is not in the expected format. | Bad JSON, a number that is not one, a malformed URL, a bad regular expression, a date that does not match. |
| `ValueError` | An argument is outside what a function accepts. | A negative size, a probability above 1, NaN in JSON. |
| `TypeError` | A value has the wrong type at run time. | `.<int>` applied to a string, a value JSON cannot represent. |
| `StateError` | An operation is not allowed in the object's current state. | Using something after closing it, `unwrapErr()` on a result that is `ok`. |
| `TimeoutError` | A deadline passed. | A request or a `wait` with a timeout. |
| `NetworkError` | The network failed. | A connection refused, a TLS or DNS failure. |
| `UnsupportedError` | The system or the function cannot do this. | Desktop notifications on a platform without them. |
| `AssertionError` | A check from [std:testing](../packages/testing.md) failed. | A failed `testing.equal`, or a failed check in a [test block](testing.md). |
| `RuntimeError` | Any other failure, and the kind of text thrown without a kind. | `throw error("something broke")`. |

A Go error that comes from a Go package is given a kind from its type: a timeout becomes `TimeoutError`, a missing file `NotFoundError`, a permission problem `PermissionError`, a network error `NetworkError`, a parse error `ParseError`, and anything unrecognised `RuntimeError`.

## Fixing a problem you do not understand

1. Read the first line of the message to the end. Most messages name the fix.
2. Look at the line and the underlined span, not only the line number: the compiler points at the exact value.
3. Fix the first error first. Later errors are often caused by it, and the compiler reports up to 20 at once.
4. Run `osl lsp check file.osl` to see every diagnostic of a file and the files it imports, including warnings.
5. If a warning is wrong for your code, silence that one line with a [comment](editor.md#silencing-a-warning) rather than turning the rule off for the project.
