# Classes

OSL supports a class-based object-oriented programming paradigm through its class syntax. Classes provide a way to create reusable object templates with properties and methods.

## Basic Class Syntax

```javascript
class ClassName (
  // Properties
  property1 = value1
  property2 = value2
  
  // Methods
  def methodName() (
    // Method body
    return value
  )
)
```

## Creating and Using Classes

Classes in OSL are defined using the `class` keyword followed by the class name and a block of code enclosed in parentheses. Once defined, you can create instances of the class and access its properties and methods. Normal `def` methods and function-valued class properties use the same parameter, return and `self` handling, including preserving declared return types in concurrent programs.

Call a class to create an independent instance. If the class defines or inherits an `init()` method, OSL calls it with the constructor arguments.

```javascript
class Person (
  name = ""

  def init(string name) (
    self.name = name
  )
)

ada = Person("Ada")
```

```javascript
// Define a class
class Person (
  name = "Unknown"
  age = 0
  
  def greet() (
    // Using ++ to concatenate strings without spaces where needed
    return "Hello, my name is " ++ self.name ++ " and I am " ++ self.age ++ " years old."
  )
  
  def birthday() (
    self.age ++
    return self.age
  )
)

// Access class methods
log Person.greet()
// "Hello, my name is Unknown and I am 0 years old."

log Person.birthday()
// 1

log Person.age
// null (properties cannot be read directly on the class name - see Class Properties)
```

## Class Properties

Properties are variables defined within a class. They store the state of the class and can be accessed and modified through class methods (via `self`), or directly through a variable the class has been assigned to. Reading a property directly on the class name itself (e.g. `Counter.count`) always returns `null` - assign the class to a variable first if you need direct property access.

```javascript
class Counter (
  count = 0
  
  def increment() (
    self.count ++
    return self.count
  )
  
  def reset() (
    self.count = 0
    return self.count
  )
)

log Counter.count
// null (direct reads on the class name return null)
log Counter.increment()
// 1
log Counter.increment()
// 2
log Counter.reset()
// 0

c = Counter
log c.count
// 0 (reads through a variable work)
```

## Private Properties

Properties that start with an underscore (`_`) are considered private and can only be accessed from within the class's methods. Accessing a private property from outside the class does not raise an error - it silently returns `null`. This provides a way to encapsulate internal state.
Public and private `self` fields use the same typed field-resolution path.

```javascript
class User (
  username = "guest"
  _password = "secret"
  
  def login(pass) (
    if pass == self._password (
      return true
    )
    return false
  )
  
  def getPassword() (
    return self._password
    // Accessible within class methods
  )
)

log User.username
// null (direct reads on the class name return null)
log User._password
// null (private reads from outside silently return null - no error)
log User.login("secret")
// true
log User.getPassword()
// "secret"
```

## Inheritance

Classes can inherit properties and methods from other classes using the `extends` keyword. This allows for code reuse and the creation of specialized versions of existing classes.

```javascript
// Base class
class Animal (
  type = "Unknown"
  sound = ""
  
  def makeSound() (
    return sound
  )
)

// Derived class
class Dog extends Animal (
  type = "Dog"
  sound = "Woof"
  
  def fetch() (
    return "Fetching the ball!"
  )
)

log Dog.type
// null (direct reads on the class name return null)
log Dog.makeSound()
// "Woof"
log Dog.fetch()
// "Fetching the ball!"
```

When a class extends another class:

* It inherits all properties and methods from the parent class
* It can override properties by redefining them
* It can add new properties and methods

## Method Context

Within class methods, properties are accessed directly by name. The method operates in the context of the class instance, so `this` is not required (unlike in some other languages).

```javascript
class Calculator (
  result = 0
  
  def add(num) (
    self.result = self.result + num
    // Directly access the result property
    return self.result
  )
  
  def subtract(num) (
    self.result = self.result - num
    return self.result
  )
)

log Calculator.add(5)
// 5
log Calculator.subtract(2)
// 3
```

## Assigning Classes to Variables

Assigning a class to a variable does **not** create a copy. Every variable assigned from the class refers to the same shared state - changes made through one variable are visible through every other variable and through the class's own methods.

```javascript
// Define a class
class Counter (
  count = 0
  
  def increment() (
    self.count ++
    return self.count
  )
)

myCounter = Counter
myCounter.count = 10

log myCounter.count
// 10
log Counter.increment()
// 11 (the class shares the same state)

other = Counter
log other.count
// 11 (every variable sees the shared state)
```

Note that the `@=` reference operator (which creates references for regular objects) does not work with classes - accessing any property or method through a name bound with `sharedCounter @= Counter` raises a TypeError.

## Examples

### Simple Game Character Class

```javascript
class Character (
  name = "Hero"
  health = 100
  strength = 10
  
  def attack() (
    return strength
  )
  
  def takeDamage(amount) (
    self.health -= amount
    if self.health < 0 (
      self.health = 0
    )
    return self.health
  )
  
  def isAlive() (
    return self.health > 0
  )
)

// Create a character
player = Character
player.name = "Alice"

// Use the character
log player.name
// "Alice"
log player.attack()
// 10
log player.takeDamage(25)
// 75
log player.isAlive()
// true
```

### Class with Private Implementation

```javascript
class SecureStorage (
  _data = {}
  
  def set(key, value) (
    self._data[key] = value
    return true
  )
  
  def get(key) (
    return self._data[key] ?? null
  )
  
  def has(key) (
    return self._data.contains(key)
  )
)

storage = SecureStorage
storage.set("username", "admin")
log storage.get("username")
// "admin"
log storage._data
// null (private reads from outside silently return null - no error)
```

## Notes

* Classes in OSL are first-class objects
* Class names typically use PascalCase by convention
* Private properties (starting with `_`) provide encapsulation; reading them from outside returns `null`
* Reading a property directly on the class name returns `null`; use a variable or a method
* Inheritance allows for code reuse through the `extends` keyword
* Assigning a class to a variable shares the class state; it does not create a copy
