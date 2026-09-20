# Record types, structs, enums, and classes

OSL has named record types, structs, enums, and classes.

Types exposed by packages use a qualified name such as `*img.Image`. Names beginning with `OSL`
belong to generated Go code and are rejected in OSL source.

## Record types

Use `type Name (...)` for a named record with typed fields and instance methods. Fields have defaults. An `init` method runs when you call the type's constructor, and its parameters become the constructor parameters.

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

Without `init`, the constructor accepts either no arguments or one argument per declared field. Methods returning a value must declare their return type; `init` does not return a value. Assignment shares a record. Use `.clone()` for an independent deep copy.

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

Extend another class with `extends`:

```osl
class AdminCounter extends Counter (
  string role = "admin"
)
```

Calls between methods retain their declared return types, including typed arrays. Child classes inherit fields, methods, and constructors. A child method with the same name replaces the inherited method.

Class assignment shares the instance. Use `.clone()` for an independent copy.

## Which form to choose

Use a record type for typed fields, constructors, methods, and optional dynamic keys. Use a struct for fixed-size values that should copy by value. Use an enum when a value must be one of a fixed set of cases. Use a class for identity, shared mutation, methods, private state, or inheritance.
