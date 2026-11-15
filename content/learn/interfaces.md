---
description: Describe what a value can do, not what it is, and write functions that accept anything that fits.
lesson: 14
---

# Interfaces

An interface lists methods. Any struct or class that has those methods, with the same parameters and return types, fits the interface, without saying so anywhere. Functions that take the interface then work with all of them.

```osl
interface Shape (
  def area() number
  def name() string
)

struct Square (
  number side = 1
  def area() number -> self.side * self.side
  def name() string -> "square"
)

class Circle (
  number r = 1
  def area() number -> 3.14 * self.r * self.r
  def name() string -> "circle"
)

def report(Shape s) string -> `${s.name()}: ${s.area()}`

log report(Square(3))
log report(Circle())
```

```output
square: 9
circle: 3.14
```

`Square` and `Circle` have nothing in common except two methods, and that's all `report` needs. There's no `implements` keyword: having the methods is enough.

## The compiler checks the fit

Passing something that lacks a method, or has one with the wrong types, is a compile error:

```osl error
interface Shape (
  def area() number
)

struct Label (
  string text = ""
)

def show(Shape s) number -> s.area()

log show(Label("hi"))
```

## Mixed collections

An array of an interface type can hold any mix of types that fit it:

```osl
interface Greeter (
  def greet() string
)

struct English (
  def greet() string -> "Hello"
)
struct French (
  def greet() string -> "Bonjour"
)
struct Japanese (
  def greet() string -> "Konnichiwa"
)

Greeter[] greeters = [English(), French(), Japanese()]
log greeters.map(g -> g.greet()).join(" / ")
```

```output
Hello / Bonjour / Konnichiwa
```

## Only the interface's methods

Through an interface-typed value, you can only call the interface's methods. The struct or class may have more, but the code holding the interface has promised to need only what the interface lists. That's what lets you swap one implementation for another.

## Interfaces in practice

Interfaces shine where one part of a program shouldn't care about the details of another. A notifier that sends messages can be real in production and a fake in tests:

```osl
interface Notifier (
  def send(string person, string message) boolean
)

class ConsoleNotifier (
  def send(string person, string message) boolean (
    log `to ${person}: ${message}`
    return true
  )
)

class RecordingNotifier (
  string[] sent = []
  def send(string person, string message) boolean (
    self.sent.append(person)
    return true
  )
)

def remindAll(Notifier n, string[] people) int (
  int ok = 0
  for person in people (
    if n.send(person, "Meeting at 10") (
      ok++
    )
  )
  return ok
)

log remindAll(ConsoleNotifier(), ["ada", "grace"])

RecordingNotifier fake = RecordingNotifier()
remindAll(fake, ["linus"])
log fake.sent
```

```output
to ada: Meeting at 10
to grace: Meeting at 10
2
["linus"]
```

Interfaces can also constrain [generics](generics.md), which is the next lesson.

:::quiz
A class has the methods an interface lists, plus two more. Does it fit the interface?

- [x] Yes: extra methods are fine.
- [ ] No: it must have exactly those methods.
- [ ] Only if it says `implements`.

An interface sets a minimum. Anything with at least those methods fits.
:::

:::exercise title="Describable"
Make both `Book` and `Film` fit the `Describable` interface, so the loop prints a line for each.

```osl
interface Describable (
  def describe() string
)

struct Book (
  string title = ""
  string author = ""
)

struct Film (
  string title = ""
  int year = 0
)

Describable[] shelf = []
log shelf.len
```

```output
Dune, a book by Frank Herbert
Alien, a film from 1979
```

> [!hint]
> Add a `def describe() string -> ...` method to each struct.

> [!hint]
> Then fill the array: `Describable[] shelf = [Book("Dune", "Frank Herbert"), Film("Alien", 1979)]`, and loop over it.

```osl solution
interface Describable (
  def describe() string
)

struct Book (
  string title = ""
  string author = ""
  def describe() string -> `${self.title}, a book by ${self.author}`
)

struct Film (
  string title = ""
  int year = 0
  def describe() string -> `${self.title}, a film from ${self.year}`
)

Describable[] shelf = [Book("Dune", "Frank Herbert"), Film("Alien", 1979)]
for item in shelf (
  log item.describe()
)
```
:::
