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

Classes in OSL are defined using the `class` keyword followed by the class name and a block of code enclosed in parentheses. Once defined, you can create instances of the class and access its properties and methods.

```javascript
// Define a class
class Person (
  name = "Unknown"
  age = 0
  
  def greet() (
    return "Hello, my name is " + name + " and I am " + age + " years old."
  )
  
  def birthday() (
    age++
    return age
  )
)

// Access class methods
log Person.greet()  // "Hello, my name is Unknown and I am 0 years old."
log Person.birthday()  // 1
log Person.age  // 1
```

## Class Properties

Properties are variables defined within a class. They store the state of the class and can be accessed and modified through class methods or directly.

```javascript
class Counter (
  count = 0
  
  def increment() (
    count++
    return count
  )
  
  def reset() (
    count = 0
    return count
  )
)

log Counter.count  // 0
log Counter.increment()  // 1
log Counter.increment()  // 2
log Counter.reset()  // 0
```

## Private Properties

Properties that start with an underscore (`_`) are considered private and can only be accessed from within the class's methods. This provides a way to encapsulate internal state.

```javascript
class User (
  username = "guest"
  _password = "secret"
  
  def login(pass) (
    if pass == _password (
      return true
    )
    return false
  )
  
  def getPassword() (
    return _password  // Accessible within class methods
  )
)

log User.username  // "guest"
log User._password  // Error: Cannot access private property
log User.login("secret")  // true
log User.getPassword()  // "secret"
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

log Dog.type  // "Dog"
log Dog.makeSound()  // "Woof"
log Dog.fetch()  // "Fetching the ball!"
```

When a class extends another class:
- It inherits all properties and methods from the parent class
- It can override properties by redefining them
- It can add new properties and methods

## Method Context

Within class methods, properties are accessed directly by name. The method operates in the context of the class instance, so `this` is not required (unlike in some other languages).

```javascript
class Calculator (
  result = 0
  
  def add(num) (
    result += num  // Directly access the result property
    return result
  )
  
  def subtract(num) (
    result -= num
    return result
  )
)

log Calculator.add(5)  // 5
log Calculator.subtract(2)  // 3
```

## Cloning vs. Referencing Classes

When assigning a class to a variable, the default behavior is to create a clone (a copy) of the class. To create a reference instead, use the `@=` operator.

```javascript
// Define a class
class Counter (
  count = 0
  
  def increment() (
    count++
    return count
  )
)

// Clone the class (creates a separate copy)
myCounter = Counter
myCounter.count = 10

log Counter.count  // 0 (original unchanged)
log myCounter.count  // 10

// Create a reference to the class
sharedCounter @= Counter
sharedCounter.count = 5

log Counter.count  // 5 (original changed)
log sharedCounter.count  // 5
```

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
    health -= amount
    if health < 0 (
      health = 0
    )
    return health
  )
  
  def isAlive() (
    return health > 0
  )
)

// Create a character
player = Character
player.name = "Alice"

// Use the character
log player.name  // "Alice"
log player.attack()  // 10
log player.takeDamage(25)  // 75
log player.isAlive()  // true
```

### Class with Private Implementation

```javascript
class SecureStorage (
  _data = {}
  
  def set(key, value) (
    _data[key] = value
    return true
  )
  
  def get(key) (
    return _data[key] ?? null
  )
  
  def has(key) (
    return _data.contains(key)
  )
)

storage = SecureStorage
storage.set("username", "admin")
log storage.get("username")  // "admin"
log storage._data  // Error: Cannot access private property
```

## Notes

- Classes in OSL are first-class objects
- Class names typically use PascalCase by convention
- Private properties (starting with `_`) provide encapsulation
- Inheritance allows for code reuse through the `extends` keyword
- By default, assigning a class creates a clone; use `@=` for references 