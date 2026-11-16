---
description: Model things with identity and changing state, with constructors, private fields, methods and inheritance.
lesson: 13
---

# Classes

A [struct](structs.md) is a value: copy it and you have two. A class is a thing with an identity. When you pass a class instance around, everyone holds the same one, and a change made through any name is seen through all of them. Use classes for things that live and change: a bank account, a player, a connection.

```osl
class Account (
  string owner = ""
  number balance = 0

  def deposit(number amount) (
    self.balance += amount
  )

  def withdraw(number amount) boolean (
    if amount > self.balance return false
    self.balance -= amount
    return true
  )
)

Account acc = Account()
acc.owner = "Ada"
acc.deposit(100)
log acc.withdraw(30)
log acc.withdraw(500)
log acc.balance
```

```output
true
false
70
```

Fields are declared like variables, with a type and a default. Methods are functions inside the class; `self` is the instance the method was called on.

## Constructors

An `init` method runs when an instance is made, and its parameters become the arguments of the class's name:

```osl
class Player (
  string name = ""
  int health = 100
  string[] inventory = []

  def init(string name) (
    self.name = name.trim()
    self.inventory.append("map")
  )

  def describe() string -> `${self.name}: ${self.health} HP, carrying ${self.inventory.join(", ")}`
)

Player p = Player("  Ada ")
p.inventory.append("lamp")
log p.describe()
```

```output
Ada: 100 HP, carrying map, lamp
```

## Shared, not copied

Assigning an instance to another name, or passing it to a function, shares it:

```osl
class Counter (
  int count = 0
  def bump() (
    self.count++
  )
)

def bumpTwice(Counter c) (
  c.bump()
  c.bump()
)

Counter a = Counter()
Counter b = a
b.bump()
bumpTwice(a)
log a.count
```

```output
3
```

`a` and `b` are the same counter, and so is the one `bumpTwice` received. When you do want an independent copy, call `.clone()`.

## Private fields

A field whose name starts with `_` can only be used by the class's own methods; using it from outside is a compile error. This keeps an object's inner details from being changed in ways its methods don't expect:

```osl
class Thermostat (
  number _target = 20

  def set(number degrees) (
    self._target = clamp(degrees, 10, 30)
  )

  def target() number -> self._target
)

Thermostat t = Thermostat()
t.set(45)
log t.target()
```

```output
30
```

```osl error
class Thermostat (
  number _target = 20
)

Thermostat t = Thermostat()
t._target = 45
```

## Inheritance

A class can extend another. It gets all of the parent's fields and methods, can add its own, and can replace a method by defining one with the same name:

```osl
class Animal (
  string name = ""
  def init(string name) (
    self.name = name
  )
  def sound() string -> "..."
  def speak() string -> self.name ++ " says " ++ self.sound()
)

class Dog extends Animal (
  def sound() string -> "woof"
)

class Cat extends Animal (
  def sound() string -> "meow"
)

Animal[] pets = [Dog("Rex"), Cat("Tom"), Animal("Rock")]
for pet in pets (
  log pet.speak()
)
```

```output
Rex says woof
Tom says meow
Rock says ...
```

An array of `Animal` can hold dogs and cats, and calling `speak` on each runs the right `sound`. `speak` is only written once, in `Animal`, and it calls `self.sound()`, which runs the child's version.

## Checking what something is

`typeof` gives an instance's real class. `.<Dog>` narrows a parent-typed value back to the child, and `.<Dog>(fallback)` gives a fallback when it's something else:

```osl
class Animal (
  def sound() string -> "..."
)
class Dog extends Animal (
  string trick = "sit"
  def sound() string -> "woof"
)

Animal a = Dog()
log typeof(a)
Dog d = a.<Dog>
log d.trick
```

```output
Dog
sit
```

> [!tip] Prefer small classes
> Classes are best for things that genuinely change over time. Plain functions and structs are easier to test and reason about, so reach for a class when identity and shared state are the point, not by default.

:::quiz
`Counter a = Counter()` and `Counter b = a`. After `b.bump()`, what is `a.count`?

- [ ] `0`
- [x] `1`

Class instances are shared: `a` and `b` are the same counter.
:::

:::exercise title="A stack"
Finish the `Stack` class: `push` adds a value on top, `pop` removes and returns the top value, and `size` returns how many values it holds.

```osl
class Stack (
  int[] _items = []

  def push(int value) (
    return
  )

  def pop() int -> 0

  def size() int -> 0
)

Stack s = Stack()
s.push(1)
s.push(2)
s.push(3)
log s.pop()
log s.size()
```

```output
3
2
```

> [!hint]
> Use the array's own methods: `self._items.append(value)`, `self._items.pop()` and `self._items.len`.

```osl solution
class Stack (
  int[] _items = []

  def push(int value) (
    self._items.append(value)
  )

  def pop() int -> self._items.pop()

  def size() int -> self._items.len
)

Stack s = Stack()
s.push(1)
s.push(2)
s.push(3)
log s.pop()
log s.size()
```
:::
