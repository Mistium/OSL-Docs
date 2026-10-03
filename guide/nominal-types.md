# Record types, structs, enums, and classes

OSL has named record types, structs, enums, and classes.

Types exposed by packages use a qualified name such as `*img.Image`. Names beginning with `OSL`
belong to generated Go code and are rejected in OSL source.

## Record types

Use `type Name (...)` for a named record with typed fields and instance methods. Fields may have defaults. A typed field without a default starts with its type's zero value. An `init` method runs when you call the type's constructor, and its parameters become the constructor parameters.

```osl
type User (
  string username = ""
  string[] roles = []

  def init(string name) (
    self.username = name.trim()
    self.roles.append("user")
  )

  def hasRole(string role) boolean (
    return self.roles.contains(role)
  )
)

User user = User("alice")
log user.username
log user.hasRole("user")
```

Methods may declare [generic type parameters and constraints](functions.md#generic-methods), such as `def keep<int* T>(T value) T -> value`. Call `instance.keep(10)` or `instance.keep<int8>(10)`. Record `init` methods cannot be generic.

Without `init`, the constructor accepts either no arguments or one argument per declared field. Methods returning a value must declare their return type; `init` does not return a value. Assignment shares a record. Use `.clone()` for an independent deep copy.

Fields can use `const<T>` to prevent later replacement or mutation through the field:

```osl
type Account (
  const<int> id = 1
  const<string[]> roles = ["reader"]
)
```

Initialize const fields with defaults or constructor field arguments. Supplied constructor
arguments must be const values or literals; field defaults establish the const view
directly. Assigning them in an `init` method counts as a later write and is rejected. Structs and classes also accept const
fields. A const view of an entire instance protects all of its fields; custom instance methods
on that view are rejected because their mutation behavior is not declared.

### Dynamic properties

Add a `string[value]` index type between the name and body to allow additional properties:

```osl
type User string[any] (
  string username = ""
  string[] roles = []
)

User user = User("alice", ["user"])
user.theme = "dark"
string name = user.username
string[] roles = user.roles
```

Declared fields retain their own types. The index type controls additional keys; `string[any]` accepts any extra value. Without an index type, unknown properties are rejected. Keys are strings.

Extra-key reads can be `null` when the key is absent. Guard the result before using it:

```osl
type Groups string[string[]] (
  string name = "recipients"
)

Groups groups = Groups()
groups.mention = ["alice"]
string[]? recipients = groups.mention
if recipients != null (
  log recipients.contains("alice")
)
```

A string literal key such as `user["roles"]` has the declared field's type. A variable key can select any field, so its result includes the declared field types, the extra-value type, and `null`. With `string[any]`, that result is `any`. Writes through variable keys validate the selected field at runtime. Declared fields cannot be deleted; optional fields can be assigned `null`.

### Loading and saving

Use `.assert(User)` to validate a dynamic object at a boundary, or `json.parse<User>(text)` to decode JSON. Both preserve permitted extension fields, apply defaults to absent declared fields, and reject invalid values. Errors identify the record and field. Decoding does not call `init`; loading a saved record should not repeat construction side effects.

Array-field mutations preserve the stored slice, including bracket access and chained mutations. In concurrent programs, the runtime locks the complete record-array update once. Mutation arguments are evaluated before acquiring that lock.

Records serialize as JSON objects, including extension fields. `.toObject()` creates a dynamic object with the record's keys; `.clone()` preserves the record type. The object methods `getKeys`, `getValues`, `getEntries`, `contains`, `insert`, `delete`, `pick`, and `omit` are available. `pick` and `omit` return dynamic objects because their results may omit declared fields.

## Generic records and classes

Put type parameters after the declaration name. Fields and methods can use those types:

```osl
type Box<T> (
  T value
  T[] items = []
  def get() T -> self.value
  def set(T value) (
    self.value = value
  )
)

Box<int8> small = Box<int8>(10, [1, 2])
int8 value = small.get()
Box<string> text = Box("hello", ["world"])
```

Explicit type arguments use `Box<int8>`. Constructors infer omitted type arguments from their arguments; calls without enough information require explicit types. Without `init`, record constructors accept either no arguments or one per field. With `init`, its typed parameters control construction and inference. Defaults evaluate separately for each instance. Fields without defaults use zero values, such as `0`, `false`, an empty string, or a null reference.

The same form works for classes:

```osl
class Holder<T> (
  T value
  def init(T value) (
    self.value = value
  )
  def get() T -> self.value
)

Holder<int8> holder = Holder<int8>(10)
log holder.get()
```

A class using `new` or `constructor` is constructed with `Holder<int8>.new(...)`. Generic classes support inheritance, including `class Child<T> extends Holder<T> (...)`. Records remain shared typed maps; classes remain shared native objects.

Type parameters retain the [function constraint syntax](functions.md#constraints), such as `type SmallBox<int* T> (...)` and `type Cache<comparable K, V> (...)`. Constraints are checked for construction and type annotations. Different instantiations are different types: `Box<int>` cannot be assigned to `Box<string>`.

Generic instance types can appear in arrays, nullable types, nested containers, aliases, and generic function signatures:

```osl
def read<T>(Box<T> box) T -> box.get()
Box<int8> small = Box<int8>(10, [])
int8 value = read(small)
```

Methods can also declare their own type parameters, but cannot shadow the owner's parameters. An `init` method uses the owner's type parameters rather than introducing its own. Field checks, const views, collection mutations, and record JSON validation retain the concrete type arguments. JSON decoding applies defaults without calling `init`.

## Structs

A struct is a compact typed value. Fields have defaults, and assignment copies the struct.

```osl
struct Point (
  int x = 0
  int y = 0
)

Point origin = Point()
Point cursor = Point(10, 20)
cursor.x = 12
```

Field access on structs and closed object shapes is verified at compile time. Accessing an unknown property or typo (such as `cursor.z`) is caught as a compile-time `TypeError`.

A constructor accepts either no arguments or one argument for every field. Convert a struct to a dynamic object explicitly:

```osl
object data = cursor.toObject()
```

The compiler does not implicitly assign a struct to `object`.

## Enums

An enum variant may carry typed data:

```osl
enum LoadState (
  Loading
  Ready(object)
  Failed(string)
)
```

Use an exhaustive `match` to read it:

```osl
def describe(LoadState state) string (
  return match state (
    LoadState.Loading -> "loading"
    LoadState.Ready(data) -> (
      return "ready: " ++ data.len
    )
    LoadState.Failed(message) -> message
  )
)
```

The compiler reports a missing enum variant. Enum values expose a numeric `tag`, and payload fields use the lowercase variant name.

## Classes

A class creates mutable reference objects with methods and inheritance.

```osl
class Counter (
  int count = 0

  def new(int start) (
    self.count = start
  )

  def increment() int (
    self.count++
    return self.count
  )
)

Counter counter = Counter.new(10)
log counter.increment()
```

`self` refers to the instance. A field that starts with `_` is private outside class methods. External access to a private field returns `null`.

Methods belong to their class. Call them through an instance or `self`, as in `self.path()`. A method name never declares a global function, so a method may share its name with a global function or a local variable.

Typed fields compile to native Go struct fields, so reads and writes of known fields are direct.
Array fields keep their element type, including arrays of classes, and support mutation methods:

```osl
class Node (
  Node[] children = []
)

Node root = Node()
root.children.append(Node())
```

A field with a function type is called like a method and keeps its signature:

```osl
type Step def(Box, int) int

class Box (
  int n = 1
  Step run = twice
)

def twice(Box b, int by) int -> b.n * by * 2

Box box = Box()
log box.run(box, 3)
```

Extend another class with `extends`:

```osl
class AdminCounter extends Counter (
  string role = "admin"
)
```

Calls between methods retain their declared return types, including typed arrays. [Generic methods](functions.md#generic-methods) retain their constraints and return types through inheritance and calls through `self`. Child classes inherit fields, methods, and constructors. A child method with the same name replaces the inherited method.

Class assignment shares the instance. Use `.clone()` for an independent copy.

## Which form to choose

Use a record type for typed fields, constructors, methods, and optional dynamic keys. Use a struct for fixed-size values that should copy by value. Use an enum when a value must be one of a fixed set of cases. Use a class for identity, shared mutation, methods, private state, or inheritance.
