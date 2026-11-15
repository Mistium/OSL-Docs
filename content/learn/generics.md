---
description: Write one function or type that works for many types, and constrain what those types must support.
lesson: 15
---

# Generics

Some code doesn't care what type it handles. Taking the last item of a list works the same for numbers, strings or structs. Generics let you write it once, with a placeholder for the type, and still keep every call fully checked.

```osl
def lastOf<T>(T[] items) T? (
  if items.len == 0 return null
  return items[-1]
)

int? n = lastOf([3, 1, 4])
string? s = lastOf(["a", "b"])
log n s
log lastOf<int>([])
```

```output
4 b
null
```

`<T>` after the name declares a type parameter. Inside the function, `T` stands for whatever type the caller uses. The compiler works out `T` from the arguments, so `lastOf([3, 1, 4])` knows it returns an `int?`. You can also say it outright, as in `lastOf<int>([])`, which you need when there's nothing to work it out from.

## Still type-checked

A generic function isn't an `any` function. Each call is checked with its real types:

```osl error
def lastOf<T>(T[] items) T? (
  if items.len == 0 return null
  return items[-1]
)

int? n = lastOf(["a", "b"])
```

## Several type parameters

```osl
def pair<A, B>(A first, B second) object -> {first, second}

def mapValues<T, U>(T[] items, def(T) U step) U[] (
  U[] out = []
  for item in items (
    out.append(step(item))
  )
  return out
)

log pair("age", 36)
log mapValues([1, 2, 3], def(int n) number -> n * 1.5)
log mapValues<string, int>(["a", "bb"], s -> s.len)
```

```output
{"first":"age","second":36}
[1.5,3,4.5]
[1,2]
```

The compiler works type parameters out from ordinary arguments, but a short lambda like `s -> s.len` doesn't say what it returns, so it can't decide `U` from it. Either write the lambda's types out with `def`, or give the type arguments explicitly.

## Constraints

Sometimes the code needs something of the type: to compare or add values, the type must be a number. A constraint before the type parameter's name says what's required:

```osl
def largest<numeric T>(T[] values) T (
  T best = values[1]
  for v in values (
    if v > best (
      best = v
    )
  )
  return best
)

def double<numeric T>(T value) T -> value + value

log largest([3, 9, 4])
log largest([0.5, 0.25])
log double(21)
```

```output
9
0.5
42
```

| Constraint | Accepts |
| --- | --- |
| `numeric` | every integer and decimal type |
| `int*` | every integer type, from `int8` to `uint64` |
| `number*` | the decimal types |
| `comparable` | anything that `==` can compare |
| an interface | any type with that interface's methods |

Without a constraint, `T` accepts anything, but you can only do what works for every type: store it, pass it on, put it in arrays.

```osl error
def double<T>(T value) T -> value + value
```

## Interfaces as constraints

An [interface](interfaces.md) as a constraint lets the function call that interface's methods, while keeping the caller's exact type:

```osl
interface Named (
  def name() string
)

struct Cat (
  string n = ""
  def name() string -> self.n
)

def loudest<Named T>(T[] items) T (
  T best = items[1]
  for item in items (
    if item.name().len > best.name().len (
      best = item
    )
  )
  return best
)

Cat winner = loudest([Cat("Tom"), Cat("Felix"), Cat("Bo")])
log winner.n
```

```output
Felix
```

`loudest` returns a `Cat`, not just a `Named`, so the caller can use `winner.n`.

## Generic types

Structs and classes take type parameters too, after their name:

```osl
class Box<T> (
  T value
  def init(T value) (
    self.value = value
  )
  def get() T -> self.value
  def set(T value) (
    self.value = value
  )
)

Box<int> count = Box<int>(1)
count.set(count.get() + 1)
log count.get()

Box<string> label = Box("hello")
log label.get().toUpper()
```

```output
2
HELLO
```

`Box<int>` and `Box<string>` are different types, and each one's methods use its own `T`.

:::quiz
Why write `def first<T>(T[] items) T` instead of `def first(any[] items) any`?

- [ ] It runs a different algorithm.
- [x] Callers keep their types: `first([1, 2])` is an `int`, so the result is checked.
- [ ] `any` can't hold arrays.

With `any`, every caller gets back an unchecked value. With `T`, the compiler knows exactly what comes back.
:::

:::exercise title="Count matches"
`countWhere` counts the items that pass a test, but only for `int` arrays. Make it generic so it works for any item type, then uncomment the last line.

```osl
def countWhere(int[] items, def(int) boolean test) int -> items.filter(test).len

log countWhere([1, 5, 8, 12], n -> n > 4)
// log countWhere(["ox", "cat", "horse"], s -> s.len > 2)
```

```output
3
2
```

> [!hint]
> Add `<T>` after the name and use `T` wherever the item type appears: `T[] items, def(T) boolean test`.


```osl solution
def countWhere<T>(T[] items, def(T) boolean test) int -> items.filter(test).len

log countWhere([1, 5, 8, 12], n -> n > 4)
log countWhere(["ox", "cat", "horse"], s -> s.len > 2)
```
:::
