# References To Objects/Variables (@=)

The reference assignment operator (`@=`) in OSL creates a reference to an existing object or variable rather than creating a copy. This allows multiple variables to point to the same underlying data.

## Syntax

```javascript
targetVariable @= sourceObject
```

## Description

By default, when you assign an object to a variable using the standard assignment operator (`=`), OSL creates a clone (a copy) of that object. The reference assignment operator (`@=`) changes this behavior, creating a reference to the original object instead.

When you use `@=`:
- Changes to the referenced object affect all variables that reference it
- No additional memory is used for storing duplicate data
- The relationship persists until one of the variables is reassigned

## Examples

### Basic Reference Assignment

```javascript
// Create an object
original = {
  value: 10
}

// Create a reference to the object
reference @= original

// Modify through the reference
reference.value = 20

// Both variables reflect the change
log original.value  // 20
log reference.value  // 20
```

### Comparing Clone vs. Reference

```javascript
// Original object
data = {
  count: 0
}

// Create a clone (copy)
clone = data

// Create a reference
reference @= data

// Modify through different variables
data.count = 5
clone.count = 10
reference.count = 15

// Results
log data.count      // 15 (affected by reference)
log clone.count     // 10 (independent copy)
log reference.count // 15 (same as data)
```

### References with Arrays

```javascript
// Original array
numbers = [1, 2, 3]

// Create a reference
sharedNumbers @= numbers

// Modify the array through the reference
sharedNumbers.append(4)

// Both variables see the change
log numbers        // [1, 2, 3, 4]
log sharedNumbers  // [1, 2, 3, 4]
```

### References with Classes

```javascript
class Counter (
  count = 0
  
  def increment() (
    count++
    return count
  )
)

// Create a reference to the class
sharedCounter @= Counter

// Modify through the reference
sharedCounter.count = 10

// Original class is affected
log Counter.count       // 10
log sharedCounter.count // 10

// Methods affect the shared state
log Counter.increment() // 11
log sharedCounter.count // 11
```

### Breaking References

A reference is broken when you reassign either variable:

```javascript
obj1 = { value: 5 }
obj2 @= obj1  // Create reference

// Both refer to the same object
log obj1.value  // 5
log obj2.value  // 5

// Break the reference by reassigning
obj2 = { value: 10 }  // New object, not a reference anymore

// Now they're independent
obj1.value = 7
log obj1.value  // 7
log obj2.value  // 10 (unchanged)
```

## Use Cases

References are particularly useful for:

1. **Sharing data** between different parts of your program
2. **Reducing memory usage** when working with large objects
3. **Implementing observer patterns** where multiple components need to react to changes in shared state
4. **Working with mutable data structures** that need to be modified by different functions

## Notes

- Use `@=` when you want changes to be visible across multiple variables
- Use `=` when you want independent copies that can be modified separately
- References in OSL are similar to references or pointers in other programming languages
- The reference relationship is not bidirectional - reassigning the original variable doesn't affect references to it
- References work with all object types: objects, arrays, classes, and functions

## Events

### `window.on(event, callback)`

The `window.on()` function allows you to listen for custom events in your application. It takes two parameters: the name of the event you want to listen for and a callback function that will be executed when the event is fired.

#### Example:

```javascript
window.on("event", () => {
  console.log("my event fired");
});

window.emit("event"); // This will trigger the above callback
```

#### Useful for Custom Events

This function is particularly useful for handling custom events that you define in your application.

#### Event List:

- **paste**: Fires when any data is pasted.
- **copy**: Fires when any data is copied to the clipboard.
- **system_focus_changed**: Fires whenever the system's tab changes focus.
- **frame_end**: Useful for adding scripts to run after the main code of your app has executed every frame.
