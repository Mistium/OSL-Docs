# .bind(context)

The `.bind()` method creates a new function that, when called, has its `this` keyword set to the provided value. This allows you to control what object the function operates on when it references `this`.

## Syntax

```javascript
functionObject.bind(contextObject)
```

## Parameters

- `contextObject` - The object to be used as the `this` value when the function is called

## Return Value

A new function with the same body but bound to the specified context.

## Description

When a function uses variables or properties from its context (using `this`), the `.bind()` method allows you to specify what object those references should point to. This is particularly useful when:

- You want to use a method from one object in the context of another object
- You want to ensure a function always has a specific context, regardless of how it's called
- You need to override the default context of a method

The original function is not modified; instead, a new function is created with the bound context.

## Examples

### Basic Usage

```javascript
obj = {
  getVal: def() -> (
    return val
  ),
  val: 10
}

log obj.getVal()
// 10

obj.getVal = obj.getVal.bind({val: 20})

log obj.getVal()
// 20
```

### Binding to a Different Object

```javascript
person = {
  name: "Alice",
  greet: def() -> (
    return "Hello, my name is " + this.name
  )
}

company = {
  name: "Acme Corp"
}

// Create a new function bound to the company object
companyGreeter = person.greet.bind(company)

log person.greet()    // "Hello, my name is Alice"
log companyGreeter()  // "Hello, my name is Acme Corp"
```

### Preserving Context in Callbacks

```javascript
counter = {
  count: 0,
  increment: def() -> (
    this.count++
    return this.count
  )
}

// Without bind, 'this' would refer to the global context
unboundIncrement = counter.increment
// This would not work as expected because 'this' is not counter

// With bind, 'this' refers to counter
boundIncrement = counter.increment.bind(counter)

log boundIncrement()  // 1
log boundIncrement()  // 2
```

## Notes

- The `.bind()` method does not execute the function it's called on; it creates a new function with the bound context
- Once a function has been bound to a context, that binding cannot be overridden
- You can use `.bind()` to create partially applied functions by providing additional arguments after the context 