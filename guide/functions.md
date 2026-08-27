# Functions

Named functions use `def`, type-first parameters, and an optional return type.

```osl
def greet(string name) string (
  return "Hello, " ++ name
)
```

A function with no declared return type may return any value. Declare the type when callers depend on it.

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

The compiler checks arguments and return values when a function has a signature type.

## Generics

Generic functions put type parameters after the name. This form is useful when a runtime assertion should preserve the requested type:

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

## Side-effect calls

OSL warns when code discards a meaningful return value. Prefix a call with `void` when discarding the result is deliberate:

```osl
void cache.insert("key", value)
```

This is common for mutating methods that also return the changed value.
