# Structs, enums, and classes

OSL has three named data forms. They solve different problems.

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

Child classes inherit fields, methods, and constructors. A child method with the same name replaces the inherited method.

Class assignment shares the instance. Use `.clone()` for an independent copy.

## Which form to choose

Use a struct for small typed records that should copy by value. Use an enum when a value must be one of a fixed set of cases. Use a class for identity, shared mutation, methods, private state, or inheritance.
