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

Pointer parameters and return values must match the declared pointee type. A pointer to `int16` cannot satisfy `*int8`, and an unrelated value cannot satisfy a pointer return type.

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

Default values apply when an argument is omitted:

```osl
def greet(string name = "world") string -> "Hello " ++ name
log greet()
log greet("OSL")

def page(int limit, int offset = limit * 2) object -> {limit, offset}
log page(20)
```

Defaults evaluate on each call in the function's scope and may use earlier parameters. Array and object literals create fresh values. Supplied values, including `false`, empty strings, and empty arrays, keep their meaning. An explicit `null` stays `null` for a nullable parameter and is rejected for a nonnullable parameter.

Required parameters must come before default parameters. A rest parameter may follow defaults and cannot itself have a default. Defaults work in named functions, lambdas, class methods, and record methods and constructors, including calls through function values and spread arguments.

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


### Constraints

Generic declarations put the constraint before its name, like ordinary parameters. Use `<int* T>` to allow any integer width:

```osl
def add<int* T>(T left, T right) T -> left + right

int8 left = 10
int8 right = 20
int8 total = add(left, right)
log add<int16>(12, 30)
```

The trailing `*` denotes a type family in generic declarations: `int*` includes signed and unsigned integers, `uint*` includes unsigned integers, and `number*` includes floating types. It does not declare a pointer. `@value` creates a pointer, while pointer type annotations use a leading `*`, such as `*ws.Connection`.

Both explicit and inferred type arguments must satisfy the constraint. Integer literals infer `int`; an `int8` variable infers `int8`. A single type parameter represents one concrete type for the call. Convert arguments explicitly when different integer widths need to share that parameter.

| Constraint | Accepted types |
| --- | --- |
| `int*` | `int`, `int8`, `int16`, `int32`, `int64`, `uint`, `uint8`, `uint16`, `uint32`, `uint64` |
| `signed` | The signed integer types |
| `uint*` | The unsigned integer types |
| `number*` | `number32`, `number64`, and their `number` alias |
| `numeric` | All integer types, `number32`, and `number64` |
| `comparable` | Scalars and named structs or enums whose fields or payloads support equality |
| `any` | Any type; also the default when no constraint is written |

`byte` and `char` satisfy integer constraints as aliases of `uint8` and `int32`.

Other constraints also go before the name: `<numeric T>`, `<signed T>`, and `<comparable T>`. `<T>` or `<any T>` remains unconstrained. A scalar type union can serve as a constraint directly, such as `<int8 | int16 T>`, or through an alias:

```osl
type Small = int8 | int16

def keep<Small T>(T value) T -> value
log keep<int8>(12)
```

Numeric constraints enable arithmetic and ordering in the function body. Addition, subtraction, and multiplication preserve the concrete type, including its integer width. Integer constraints also enable remainder, bitwise AND, OR, XOR, complement, and left and arithmetic right shifts. Division returns `number64`, as ordinary integer division does. A constrained generic can forward its type argument to another generic when its permitted types satisfy that function's constraint.

A named [interface](nominal-types.md#interfaces) can constrain a type parameter by its methods:

```osl
interface Reader (
  def read() int
)

def load<Reader T>(T source) int -> source.read()
```

Explicit and inferred type arguments must supply matching methods. The function body can call the declared methods and retains `T` for its inputs and returns. The same constraints work on generic records, classes, and methods.

Integer targets also work with `.as<T>`. `.tryAs<T>` returns `result<T, string>` and reports invalid values or overflow. Const inputs and parameter defaults compose with generics:

```osl
def constant<int* T>(const<T> value) T -> value
log constant<int8>(10)

def double<int* T>(T value, T other = value) T -> value + other
log double<int8>(5)

def parse<int* T>(any value) result<T, string> -> value.tryAs<T>
log parse<int8>("128").isErr()
```


A `T value` parameter stays checked at the call site. To test an arbitrary value against `T` at runtime, accept `any`:

```osl
def is<int* T>(any value) boolean (
  return try(value.<T>).isOk()
)

log is<int16>("lmao") // false
log is<int8>(10)      // true
log is<int8>(128)     // false: out of range
```

This assertion rejects numeric strings and fractional values; it does not parse or truncate them. Use `.tryAs<T>` when conversion is intended. With `T value` instead of `any value`, `is<int16>("lmao")` is a compile error.

The former `<T: integer>` form is replaced by `<int* T>`. Explicit calls keep their existing syntax, such as `is<int16>(value)`.

### Array pointer constraints

Use `<*_[] T>` to require a pointer to an array with any element type. `_` is the wildcard within the constraint shape, and `T` names the entire matched pointer type:

```osl
def del<*_[] T>(T arr, int item) (
  arr.delete(item)
)

int[] arr = [1, 2, 3, 4]
del(@arr, 2)
log arr // [1, 3, 4]
```

The call infers the whole pointer type as `T`; it does not bind `T` to the array's element type. `<T>` by itself remains an unconstrained generic parameter.

`@arr` refers to the original variable's storage. Calling collection mutation methods through that pointer updates its array and length. Positions are 1-based; deletion outside `1` through the current length leaves the array unchanged. Deletion, append, prepend, insertion, and resizing return the same pointer, so calls can be chained. Pop and shift return an element. `.len` reads the current length through the pointer.

Indexing, indexed assignment, `for ... in`, and collection methods preserve the matched element type. A loop through an array pointer iterates a snapshot. Callbacks for `map`, `filter`, `some`, `every`, and `sortBy` infer their input type:

```osl
def duplicate<*_[] T>(T values) (
  values.append(values[1])
  for value in values (
    log value
  )
)

string[] words = ["hello"]
duplicate(@words) // words is now ["hello", "hello"]
```

The wildcard element stays abstract inside the function. Appending an existing element is safe; appending `10` is rejected because the caller could pass a string array. Use an element parameter when the function needs a specific capability:

```osl
def doubled<int* T>(T[] values) T[] -> values.map(value -> value * 2)
int8[] small = [2, 3]
int8[] larger = doubled(small) // [4, 6], retains int8[]
```

Single-expression callback returns infer element reads, literals, comparisons, unary signs, and arithmetic. More complex callbacks can declare their return type explicitly. A declared callback input must accept the collection element type. Inference requires repeated uses of a type parameter to agree; different numeric widths do not silently select a wider type.

Wildcard shapes keep pointer depth explicit: `*_[]` matches a pointer to any array, `**_[]` matches a pointer to an array pointer, and `_[][]` matches nested arrays. An array can contain pointers or other composite element types. A type argument must match the complete declared shape, whether supplied explicitly or inferred.

These constraints work in functions, record methods, class methods, and generic forwarding. Arrays passed by value and scalar pointers cannot satisfy `*_[]`. Const arrays cannot provide mutable pointers, and a `const<T>` parameter cannot call `.delete()`.

The earlier `<*T[]>` form remains supported with its original whole-pointer meaning. Ordinary type annotations also retain their existing meaning: `*ws.Connection[]` is an array of connection pointers. Wildcard constraint shapes do not change pointer-array annotation precedence.

### Generic methods

Record and class methods declare type parameters after the method name. Calls infer their types or accept explicit arguments:

```osl
type Calculator (
  def add<int* T>(T left, T right) T -> left + right
)

Calculator calculator = Calculator()
log calculator.add(2, 3)
log calculator.add<int8>(2, 3)
```

Generic methods can use `self`, defaults, const inputs, and rest parameters. Classes inherit generic methods, and calls between methods keep the concrete return type. Constructors (`init`, `new`, and `constructor`) cannot declare method type parameters. Supply explicit type arguments when the inputs do not determine every type parameter.

Generic records and classes also declare type parameters after their names. Their fields and methods retain those types; see [generic records and classes](nominal-types.md#generic-records-and-classes).

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
