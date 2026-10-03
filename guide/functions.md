# Functions

Named functions use `def`, type-first parameters, and an optional return type.

```osl
def greet(string name) string (
  return "Hello, " ++ name
)
```

A function with no declared return type may return any value. Declare the type when callers depend on it.

A return annotation can name an array of package handles, including nested and nullable arrays:

```osl
import "std:ws"

def connections() *ws.Connection[] (
  return []
)

def optionalConnections() *ws.Connection[]? (
  return null
)
```

`*ws.Connection[]` is an array of connection pointers. `*ws.Connection[][]` is an array of those arrays. The trailing `?` allows the entire array to be null.

Named concise functions use `->` and one expression. The return type may be any type, including generic, keyed, and nullable types such as `result<T, string>`, `result<T, string>?`, `string[number]`, and `number[]?`. Statements after the definition execute normally:

```osl
def greeting() string -> "hello"
log greeting()
log "after"
```

A function cannot share its name with a runtime helper or an imported package, such as `none`, `atob`, or `json` after `import "std:json"`. The compiler reports the declaration, for example `Function 'none' clashes with a built-in runtime name; rename it, for example to 'noneFn'`.

For a function that does nothing, use `def noop() ( return )`. An empty `()` body is invalid; the diagnostic suggests this correction.

Small [inline check blocks](../reference/testing.md#inline-checks) can sit beside a function in the same source file:

```osl
test (
  greeting() == "hello"
)
```

Run them with `osl test`. Normal builds omit the blocks and their test-only imports.

## Const parameters and returns

Use `const<T>` to require a const argument and prevent writes through the parameter:

```osl
def total(const<int[]> values) int (
  return values.sum().as<int>
)
```

The parameter accepts const values and literals. A mutable variable cannot be passed
implicitly, even when its current value is known:

```osl
def read(const<int> value) int -> value
const<int> fixed = 10
int editable = 20
log read(fixed) // accepted
log read(10) // accepted: literal
log read(editable.as<const<int>>) // accepted: explicit const conversion
// read(editable) // compile error: requires const<int>
```

This requirement also applies to generic calls, callbacks, spread arguments, and typed
constructor inputs. Reassignment and collection writes are rejected inside the function.
A `const<T>` return type requires a const value or literal and preserves read-only
protection for callers. A mutable collection parameter cannot accept a const view. See
[const types](types.md#const-types) for copies, aliases, callbacks, and generic returns.

## Lambdas

Use `->` for an anonymous function:

```osl
auto double = (int value) int -> value * 2
int[] doubled = [1, 2, 3].map(double)
```

A block lambda uses `def`:

```osl
auto validate = def(object record) result -> (
  if record.id == null return result.err("missing id")
  return result.ok(record)
)
```

Lambdas capture variables from their surrounding scope.

## Optional and rest parameters

A trailing `T?` parameter may be omitted and receives `null`:

```osl
def page(int limit, string? cursor) object (
  return {limit, cursor}
)

page(20)
```

Default values in parameter declarations, such as `boolean enabled = true`, are unsupported. The compiler reports the parameter name and suggests a nullable parameter with a fallback in the body:

```osl
def enabled(boolean? value) boolean (
  return value ?? true
)

log enabled()
log enabled(false)
```

The omitted argument uses the fallback; an explicit `false` remains `false`. Apply the same pattern to arrays and other nullable parameters.

Use `...name` to collect extra arguments:

```osl
def collect(string prefix, ...values) array (
  return values.map(value -> prefix ++ value)
)
```

Spread an array at a call site:

```osl
log max(...scores)
```

## Function types

Name a reusable signature with `type` and `def`:

```osl
type Formatter def(object) string

def render(object value, Formatter format) string (
  return format(value)
)
```

The assignment form `type Formatter = def(object) string` declares the same type, and `fnc` or `function` may replace `def`. Compiler diagnostics always print function types with `def`, such as `def(object) string`, and name functions as written in source. A lambda assigned to a signature type declares its return type, as in `def(object value) string -> value.toStr()`.

A function name used without a call is a value of its signature type. It can be stored in `any`, `function`, or a matching signature type. Assigning, passing, or returning it as a string, number, boolean, object, array, or record is a compile error, such as `Cannot use def(int) int as string; call the function or declare a function type`:

```osl
def double(int x) int -> x * 2

type Transform def(int) int
Transform step = double
string label = double(4).toStr()
```

The compiler checks arguments and return values when a function has a signature type. Imported signature types also apply to callbacks passed from other modules. Nullable array and dictionary parameters give literals their declared element and value types.

## Generics

Generic functions put type parameters after the name. When calling a generic function, type arguments can be supplied explicitly or inferred automatically from input argument types:

```osl
def shift<T>(T[] arr) T? (
  if arr.len == 0 return null
  T last = arr.last()
  arr.resize(arr.len - 1)
  return last
)

int? lastNum = shift([1, 2, 3])
string? lastWord = shift(["a", "b"])
```

Explicit type arguments are useful when a runtime assertion should preserve the requested type or when the type cannot be inferred:

```osl
def checked<T>(any value) result<T, string> (
  return try(value.<T>)
)

result<string, string> name = checked<string>(input)
```

Generic result types preserve both success and error types:

```osl
result<string[object], string> records = checked<string[object]>(input)
```

## Calling and binding

Keep the opening `(` next to the function or method name: `greet("Ada")` and `name.toUpper()`. A space or tab before the argument parentheses is invalid, so `greet ("Ada")` reports a syntax error.

For generic calls, keep `(` next to the closing `>`: `checked<string>(input)`.

Commands require whitespace before their arguments. `log (10 + 10)` uses the `log` command and prints `20`; the parentheses group its argument. In `log name (10 + 10)`, `name` and `(10 + 10)` are separate arguments. Spaces before statement blocks, such as `if ready ( log "ready" )`, remain valid.

Functions are values. `.call(...)` invokes a function, and `.bind(...)` returns a function with leading arguments fixed.

```osl
def add(int left, int right) int (
  return left + right
)

auto addTen = add.bind(10)
log addTen(5)
```

## Package method names

Package method lookup is case-insensitive. Reference pages use lower camel case as the canonical
spelling, so `connection.send(message)` is preferred even though `connection.Send(message)` calls
the same method. Methods whose embedded implementation name begins with `OSL` are private and are
not available to OSL programs.

## Side-effect calls

OSL warns when code discards a meaningful return value. Prefix a call with `void` when discarding the result is deliberate:

```osl
void cache.insert("key", value)
```

This is common for mutating methods that also return the changed value.

`void` also accepts a value expression, such as `void values.lastIndex("Ada")`,
`void count`, or `void null`. It evaluates the expression once and discards the result.
Array methods that require callbacks report an OSL type error when the callback is missing.

## Unknown built-in methods

The compiler reports an unknown method on a built-in value at the OSL call site. Strings use multiplication for repetition, such as `"a" * 3`. The unsupported `"a".repeat(3)` form reports this correction.
