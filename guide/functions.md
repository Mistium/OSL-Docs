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

Named concise functions use `->` and one expression. Statements after the definition execute normally:

```osl
def greeting() string -> "hello"
log greeting()
log "after"
```

For a function that does nothing, use `def noop() ( return )`. An empty `()` body is invalid; the diagnostic suggests this correction.

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
  return try(value.assert(T))
)

result<string, string> name = checked<string>(input)
```

Generic result types preserve both success and error types:

```osl
result<string[object], string> records = checked<string[object]>(input)
```

## Calling and binding

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
