---
description: Let a function change a variable its caller owns, with @variable pointers and shared ptr.new cells.
package: ptr
---

# ptr

OSL passes numbers, strings and booleans by value: a function gets its own copy, so changing it doesn't affect the caller. Usually that is what you want. When you want a function to change the caller's variable itself, `std:ptr` gives you two tools:

- `@variable` points at an existing variable. Read and write through it with `ptr.deref` and `ptr.set`.
- `ptr.new(value)` makes a shared cell that doesn't belong to any variable. Copies of the cell share the one value.

Pointers are rare in everyday OSL. Arrays, objects and classes are already shared when you pass them, and a function can return several values in an array or object. Reach for `ptr` for the cases that remain: an out-parameter, a counter many parts of a program update, or an interop boundary where Go expects a pointer.

## Pointing at a variable

`@count` makes a pointer to the variable `count`. A parameter that receives one is typed `*int`. `ptr.deref` reads the variable it points at, and `ptr.set` writes it:

```osl
import "std:ptr"

def bump(*int n) (
  ptr.set(n, ptr.deref(n) + 1)
)

int count = 1
bump(@count)
bump(@count)
log count
```

```output
3
```

Without the `@`, `bump(count)` would be a type error, and `count` would be a copy anyway. The `@` at the call site makes it obvious that the callee can change the variable.

## Swapping two variables

A function that must change two of the caller's variables is the classic use:

```osl
import "std:ptr"

def swap(*int x, *int y) (
  int saved = ptr.deref(x)
  ptr.set(x, ptr.deref(y))
  ptr.set(y, saved)
)

int a = 1
int b = 2
swap(@a, @b)
log a b
```

```output
2 1
```

## Other types

`ptr.deref` returns a value of any type, so say what you expect before using it with methods of that type:

```osl
import "std:ptr"

def shout(*string text) (
  ptr.set(text, ptr.deref(text).as<string>.toUpper())
)

string name = "ada"
shout(@name)
log name
```

```output
ADA
```

## A shared cell

`ptr.new(value)` makes a `*ptr.Pointer`: a cell holding one value. `cell.value()` reads it and `cell.set(v)` replaces it. Unlike `@`, the cell isn't tied to a variable, so it can be handed to many functions and outlives the scope that made it:

```osl
import "std:ptr"

def addTo(*ptr.Pointer total, int amount) (
  total.set(total.value() + amount)
)

auto total = ptr.new(10)
addTo(total, 5)
addTo(total, 100)
log total.value()
```

```output
115
```

Copying a cell does not copy the value. Both names refer to the same cell:

```osl
import "std:ptr"

auto first = ptr.new(1)
auto second = first
second.set(2)
log first.value()
```

```output
2
```

`cell.swap(other)` exchanges the values of two cells in place.

```osl
import "std:ptr"

auto left = ptr.new("left")
auto right = ptr.new("right")
left.swap(right)
log left.value() right.value()
```

```output
right left
```

## Same value or same cell

`==` on two pointers compares what they hold, and `===` asks whether they are the same cell. The compiler warns when you use `==` on cells, so write what you mean:

```osl
import "std:ptr"

auto a = ptr.new(1)
auto b = ptr.new(1)
auto c = a
log a === b
log a === c
```

```output
false
true
```

## Counters that several functions share

A shared cell is a simple way to count things across callbacks, without a global:

```osl
import "std:ptr"

def makeHandler(*ptr.Pointer seen, string label) def(string) (
  return def(string item) (
    seen.set(seen.value() + 1)
    log label item
  )
)

auto seen = ptr.new(0)
auto onA = makeHandler(seen, "a:")
auto onB = makeHandler(seen, "b:")
onA("x")
onB("y")
onA("z")
log seen.value()
```

```output
a: x
b: y
a: z
3
```

For state shared between threads, use `std:sync`, which guards access. A plain cell isn't protected against two threads changing it at once.

## Null and low-level queries

`ptr.isNull(value)` is true for `null` and for a null Go pointer. The rest of the package (`sizeOf`, `alignOf`, `offsetOf`, `addressOf`, `sliceLen`, `sliceCap`) answers questions about how a value is laid out in memory. They are for debugging and for talking to Go code. Addresses change from run to run, so never store one or print it in a test:

```osl
import "std:ptr"

log ptr.isNull(null) ptr.isNull(5)
log ptr.sizeOf(1)
int[] items = [1, 2, 3]
log ptr.sliceLen(items)
```

```output
true false
8
3
```

## API reference

::api
