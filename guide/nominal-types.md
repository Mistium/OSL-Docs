# Record types, structs, enums, classes, and interfaces

OSL has named record types, structs, enums, classes, and interfaces.

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

Without `init`, the constructor accepts either no arguments or one argument per declared field. Fields can also be passed by name, in any order; omitted fields keep their defaults. Methods returning a value must declare their return type; `init` does not return a value. Assignment shares a record. Use `.clone()` for an independent deep copy.

```osl
type NamedUser (
  string name = ""
  int age = 0
)

NamedUser ada = NamedUser(age = 30, name = "ada")
```

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

An array field shares its array, as a record is shared. `string[] roles = user.roles`, `user.roles = list`, `User("ada", list)`, `other.roles = user.roles` and passing `user.roles` to an array parameter all name the same array, so an append, insert, delete or item write through any of them is seen through the others. Giving the field a new array, as in `user.roles = []`, only changes the field. `.clone()` gives the copy its own arrays.

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

## Interfaces

An interface declares the methods a value must provide. It can be used as a parameter, variable, return type, or generic constraint:

```osl
interface Reader (
  def read() int
)

class Source (
  int value = 7
  def read() int -> self.value
)

def load<Reader T>(T source) int -> source.read()
log load(Source())

Reader reader = Source()
log reader.read()
```

Records and classes satisfy an interface automatically when their instance methods have matching parameter and return types. There is no `implements` declaration. Extra methods are allowed. Generic record and class instances use their concrete method types when checked. An interface requiring more methods can be passed to one requiring a subset with matching signatures.

A constrained generic retains its concrete type. Only the methods declared by its interface are available in the function body; instance fields are not exposed. Missing methods, incompatible signatures, and invalid method arguments produce compile-time errors.

Interface methods declare signatures without bodies or parameter defaults. Variadic parameters are supported. An implementation with default parameters does not satisfy an interface method. Interfaces must have at least one method and cannot declare type parameters or generic methods. Built-in collection operations and package helper methods do not automatically implement interfaces.

Interface values share their underlying record or class. Calls through `const<Reader>` are rejected because interface signatures do not declare whether a method mutates its receiver. Interface declarations can be imported like other named types.

## Structs

A struct is a compact typed value. Fields have defaults, and assignment copies the struct. A field may be nullable.

A copy includes the struct's arrays. Assigning a struct, passing it to a function, returning it, storing it in a field, an array or a map, and binding it as a `for` loop variable each give the new place its own arrays. Changing one copy's arrays leaves the others alone:

```osl
struct Path (
  string name = ""
  int[] steps = []
)

Path first = Path("a", [1, 2])
Path second = first
second.steps.append(3)
log first.steps // [1, 2]
```

- A plain `T[]` field copies its array with the struct.
- A nullable `T[]?` field copies its array when it holds one and stays `null` when it is `null`.
- Nested struct values are copied the same way, and so are struct values held in an array field.
- What the copied arrays hold by reference stays shared: an array of pointers such as `*int[]` copies the pointers, not what they point at, and an array of arrays copies the outer array only.
- Giving a struct field an existing array, as in `Path("a", steps)` or `path.steps = steps`, stores a copy, so the struct and `steps` don't change each other.
- Arrays of structs built from another array, such as `[...paths]`, `paths ++ more`, `paths.filter(...)`, `paths.concat(...)` and `paths.map(...)`, hold copies of the structs.
- Changing an array inside a struct where it is stored, as in `paths[1].steps.append(4)` or `box.path.steps.append(4)`, changes that stored struct.

```osl
struct Point (
  int x = 0
  int y = 0
)

struct Profile (
  string name = ""
  string? bio = null
)

Point origin = Point()
Point cursor = Point(10, 20)
cursor.x = 12
```

Structs also parse from JSON. Missing keys take the field's default; `T?` fields accept `null`; a wrong type is a `ParseError` naming the struct and field; keys the struct doesn't declare are ignored.

```osl
import "std:json"

Profile profile = json.parse<Profile>("{\"name\":\"Ada\"}").unwrap()
log profile.bio == null
```

Field access on structs and closed object shapes is verified at compile time. Accessing an unknown property or typo (such as `cursor.z`) is caught as a compile-time `TypeError`.

A constructor accepts either no arguments or one argument for every field. Fields can also be passed by name, in any order; omitted fields keep their defaults:

```osl
Point partial = Point(y = 5)
```

Braces construct the same way Go writes struct literals. `Point{x: 10}`
means `Point(x = 10)`, with the same ordering, defaults, and errors:

```osl
Point braced = Point{x: 10, y: 20}
log braced.x
```

Convert a struct to a dynamic object explicitly:

```osl
object data = cursor.toObject()
```

The compiler does not implicitly assign a struct to `object`.

### Inline structs

A struct doesn't need a name. Write its fields inline, separated by commas, where a type goes:

```osl
struct(int x, int y = 0) origin = struct(x = 3)

def area(struct(int w, int h) size) int (
  return size.w * size.h
)

def bounds() struct(int w, int h) (
  return struct(w = 640, h = 480)
)

log area(bounds())
```

`struct(x = 3)` is an inline struct value. When it is assigned, returned or passed where an inline struct type is expected, it builds that type: missing fields take their defaults and values convert to the field types. Anywhere else, the field types come from the values:

```osl
auto score = struct(name = "ada", points = 3)
log score.points + 1
```

A field written without a default takes its type's zero value: `0`, `""`, `false`, `[]`, `{}`, `null` for a nullable type, or the struct's own defaults for a struct.

Inline structs with the same fields, in the same order, are the same type wherever they're written, so values move freely between them. Field order is part of the type: `struct(int x, int y)` and `struct(int y, int x)` are different. Because the same fields mean the same type, they can't be declared again with different defaults.

Inline structs behave like named structs: field access is checked at compile time, assignment copies, `==` compares fields, and they nest, form typed arrays (`struct(string name, int score)[]`) and can be nullable (`struct(int x)?`). Errors print them as written, such as `struct(int x, int y)`.

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

A child that declares an inherited field again gives it a new default. It is still the parent's field, so the instance has one value for it. The declaration must keep the field's type.

Class assignment shares the instance. Use `.clone()` for an independent copy.

### Subclasses

A child class can be used anywhere one of its ancestors is expected: variables, parameters, fields, return types, array items, map values, and type arguments. A method called through such a value runs the instance's own override:

```osl
class Shape (
  def area() number -> 0
  def describe() string -> "area " ++ self.area()
)

class Square extends Shape (
  number side = 1
  def area() number -> self.side * self.side
)

class Circle extends Shape (
  number r = 1
  def area() number -> 3.14 * self.r * self.r
)

def largest(Shape[] shapes) Shape (
  Shape best = shapes[1]
  for shape in shapes (
    if shape.area() > best.area() (
      best = shape
    )
  )
  return best
)

Shape[] shapes = [Square(), Circle(), Shape()]
log largest(shapes).describe()
```

Inherited methods dispatch too. `describe` calls `self.area()`, and on a `Square` that runs `Square.area`. An override must take the same parameter types and return the same type as the method it replaces, because a call through the parent class can run it.

Fields read and written through a parent-class value are the instance's own fields. Only the parent's fields and methods are visible through it. To reach the rest, narrow the value back to the child with `.<Child>`, or with `.<Child>(fallback)` to substitute a value when the instance is another class:

```osl
Shape shape = Square()
Square square = shape.<Square>
log square.side

Circle circle = shape.<Circle>(Circle())
log circle.r
```

`.<Child>` reports `TypeError: Cannot assert Square as Circle` when the instance is a different subclass. A parent value can't be used as a child without one of these, and a class can't be used as a sibling class.

The rest of the language sees the instance's own class:

- `typeof(shape)` is `"Square"`.
- `toStr`, `log`, and `json.stringify` include the subclass's fields.
- `.clone()` copies the instance as its own class.
- `===` compares instances, whichever class each value is declared with.

A nullable parent type such as `Shape?` accepts `null`, a child, or a nullable child; a null child stays `null`.

An array of a child class is not an array of its parent. `Square[]` can't be used as `Shape[]`, because a `Shape[]` could be given a `Circle`. Declare the array with the parent type when it may hold several subclasses. The same rule applies to typed objects.

Generic types and functions hold subclasses the same way: a `Box<Shape>` can hold a `Square`, and a generic method called through a `Shape` runs the instance's override. That includes a child that gives a generic parent other type arguments, such as `class IntBox extends Box<int>`, `class Swap<A, B> extends Pair<B, A>`, or `class Wrap<T> extends Box<T[]>`. One case can't dispatch: a generic method called through the parent inside a generic function, with that function's own type parameters as its type arguments, when some child has type parameters that the parent's type arguments don't give. The compiler reports that call; call the method with concrete type arguments instead.

A class's fields and methods are reached directly when nothing extends it, or when a value is known to be exactly that class. Calls through a parent-class value cost one dynamic dispatch.

`json.parse<T>` builds an instance the way the class's constructor does: absent keys keep their defaults, `init` doesn't run, and keys the class doesn't declare are ignored. `.assert(T)` and `.<T>` on a dynamic value do the same for an object. They return a value that is already an instance of the class, or of one of its subclasses, unchanged. JSON doesn't say which class an object is, so an object decoded into a `Shape` slot is exactly a `Shape`. That holds wherever the slot is: a field, an array item, a map value, a nested array or map such as `Shape[][]`, a record or struct field, or a generic class such as `Box<Shape>`.

## Nested structs

A struct declared inside a class body belongs to that class. Name it bare
inside the class and qualified outside; both spellings are the same type.
The bare name is only visible inside the class, so two classes can each
declare their own `node` without colliding. Outside the class, always use
the qualified name:

```osl
class bf (
  struct node (
    string op = ""
    int amt = 0
  )

  def parse(string script) bf.node[] (
    bf.node[] out = []
    return out
  )
)

bf.node[] nodes = bf.parse(">")
```

Construct nested structs with positional arguments, named arguments, or brace
literals, inside methods and outside the class. Types are not instance
members, so they never take `self.` — write `node` inside and `bf.node`
outside.

Prefix a type with `*` to store pointers. A pointer array such as
`*bf.node[]` holds `*bf.node` values, so indexing yields a pointer instead of
copying the struct. Take a pointer with `@` and read fields through it as
usual:

```osl
class bf (
  struct node (
    string op = ""
    int amt = 0
  )

  def parse(string script) *bf.node[] (
    *bf.node[] out = []
    for l in script (
      out.append(@node(l, out.len))
    )
    return out
  )
)

*bf.node[] nodes = bf.parse(">")
log nodes[1].op
```

An element of a pointer array can be `null`, so guard an empty or missing slot
before reading it. Returning `*bf.node[]` from a function or method works the
same as any other array type.

## Which form to choose

Use a record type for typed fields, constructors, methods, and optional dynamic keys. Use a struct for fixed-size values that should copy by value. Use an enum when a value must be one of a fixed set of cases. Use a class for identity, shared mutation, methods, private state, or inheritance.
