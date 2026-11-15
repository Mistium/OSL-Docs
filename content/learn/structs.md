---
description: Define your own value types with named, typed fields, give them methods, and load them from JSON.
lesson: 11
---

# Structs

Objects are flexible, but nothing stops you misspelling a key or putting text where a number belongs. A struct fixes the shape: it names each field and gives it a type and a default, and the compiler checks every use.

```osl
struct Point (
  int x = 0
  int y = 0
)

Point origin = Point()
Point p = Point(3, 4)
log origin.x origin.y
log p.x p.y
log p
```

```output
0 0
3 4
{"x":3,"y":4}
```

Call the struct's name like a function to make one. With no arguments, every field takes its default. With arguments, give one per field, in order.

## Named fields

Pass fields by name to set only some of them, in any order. Braces do the same thing:

```osl
struct Window (
  string title = "Untitled"
  int width = 800
  int height = 600
  boolean resizable = true
)

Window w = Window(title = "Editor", resizable = false)
log w.title w.width w.height w.resizable

Window small = Window{width: 320, height: 240}
log small.title small.width
```

```output
Editor 800 600 false
Untitled 320
```

## The compiler knows the shape

Because every field is declared, a typo or a wrong type is caught before the program runs:

```osl error
struct Point (
  int x = 0
  int y = 0
)

Point p = Point()
p.z = 5
```

```osl error
struct Point (
  int x = 0
  int y = 0
)

Point p = Point()
p.x = "left"
```

## Methods

A struct can have functions of its own, called methods. Inside a method, `self` is the struct it was called on:

```osl
struct Rect (
  number width = 0
  number height = 0

  def area() number -> self.width * self.height
  def isSquare() boolean -> self.width == self.height
  def scaled(number by) Rect -> Rect(self.width * by, self.height * by)
)

Rect r = Rect(3, 4)
log r.area()
log r.isSquare()
log r.scaled(2).area()
```

```output
12
false
48
```

## Copies, not shares

Arrays, objects and [classes](classes.md) are shared when you assign them. A struct is a value, like a number: assigning it, passing it to a function or storing it somewhere makes a copy. Changing the copy leaves the original alone:

```osl
struct Point (
  int x = 0
  int y = 0
)

Point a = Point(1, 1)
Point b = a
b.x = 99
log a.x b.x

def moved(Point p) Point (
  p.x += 10
  return p
)

Point c = moved(a)
log a.x c.x
```

```output
1 99
1 11
```

This makes structs safe to pass around: no function can change your struct behind your back. Two structs with the same field values are equal:

```osl
struct Point (
  int x = 0
  int y = 0
)

log Point(1, 2) == Point(1, 2)
log Point(1, 2) == Point(2, 1)
```

```output
true
false
```

## Fields that may be empty

A field's type can end in `?` to allow `null`. Fields can also hold arrays, maps and other structs:

```osl
struct Address (
  string city = ""
  string country = ""
)

struct Person (
  string name = ""
  string? nickname = null
  string[] languages = []
  Address home = Address()
)

Person ada = Person(name = "Ada", languages = ["English", "French"], home = Address("London", "UK"))
log ada.nickname ?? ada.name
log ada.languages.len
log ada.home.city
```

```output
Ada
2
London
```

## Loading structs from JSON

Structs are the natural shape for data from files and APIs. `json.parse<Point>` checks the JSON against the struct and gives you a real `Point`, with the compiler's checks from then on. It returns a [result](errors.md), because the JSON might not fit:

```osl
import "std:json"

struct User (
  string name = ""
  int age = 0
  boolean admin = false
)

User u = json.parse<User>(`{"name": "Grace", "age": 85}`).unwrap()
log u.name u.age u.admin

switch json.parse<User>(`{"name": "Bob", "age": "old"}`) (
  case ok(user)
    log user.name
  case err(e)
    log "rejected: " ++ e.kind
)
```

```output
Grace 85 false
rejected: ParseError
```

Missing keys take the field's default, keys the struct doesn't declare are ignored, and a value of the wrong type is an error that names the struct and field. Going the other way, `log` and `json.stringify` turn a struct into JSON.

## Structs without a name

For a one-off shape, write the fields inline where a type goes:

```osl
def bounds() struct(int w, int h) (
  return struct(w = 640, h = 480)
)

auto size = bounds()
log size.w * size.h
```

```output
307200
```

> [!tip] Struct or class?
> Use a struct for data: a point, a colour, a settings block, a row from a file. Use a [class](classes.md) for things with an identity that several parts of a program share and change, like a game's player or an open connection.

:::quiz
`Point a = Point(1, 1)`, then `Point b = a` and `b.x = 5`. What is `a.x`?

- [x] `1`
- [ ] `5`

Structs are copied when assigned, so `b` is a separate point.
:::

:::exercise title="Shopping basket"
Give `Item` a `total` method that returns its price times its quantity, then print the basket's total.

```osl
struct Item (
  string name = ""
  number price = 0
  int quantity = 1
)

Item[] basket = [Item("tea", 3.5, 2), Item("milk", 1.25, 1), Item("biscuits", 2, 3)]

log basket.len
```

```output
14.25
```

> [!hint]
> Inside the struct, add `def total() number -> self.price * self.quantity`.

> [!hint]
> `basket.map(i -> i.total()).sum()` adds them up.

```osl solution
struct Item (
  string name = ""
  number price = 0
  int quantity = 1

  def total() number -> self.price * self.quantity
)

Item[] basket = [Item("tea", 3.5, 2), Item("milk", 1.25, 1), Item("biscuits", 2, 3)]

log basket.map(i -> i.total()).sum()
```
:::
