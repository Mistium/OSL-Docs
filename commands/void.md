# void

The `void` command evaluates its parameters but discards the result. It's useful when you want to execute a function or expression for its side effects without using the return value.

## Syntax

```javascript
void expression
```

## Description

The `void` command takes an expression as its parameter, evaluates it completely, and then discards the result. This is particularly useful for:

1. Executing functions solely for their side effects
2. Suppressing unwanted return values
3. Explicitly indicating that a return value is being ignored

## Examples

### Executing Functions

```javascript
// Define a function with side effects
def logMessage(message) (
  log message
  return message  // Return value we don't need
)

// Execute the function and discard the return value
void logMessage("Hello, World!")
```

### Executing Methods with Side Effects

```javascript
// Array with a method that has side effects
numbers = [1, 2, 3, 4, 5]

// Execute the sort method for its side effect (sorting the array)
void numbers.sort()

// Now the array is sorted, but we didn't need the return value
log numbers  // [1, 2, 3, 4, 5]
```

### Suppressing Unwanted Return Values

```javascript
// Function that returns a value we want to ignore
def processData(data) (
  // Process the data...
  return "Processing complete"  // Return value we don't need
)

// Execute the function but ignore its return value
void processData(userInput)
```

### Executing Multiple Expressions

You can use `void` with multiple expressions by grouping them:

```javascript
// Execute multiple expressions and discard their results
void (
  counter++,
  updateUI(),
  logActivity("User action completed")
)
```

### Using in Event Handlers

```javascript
// In an event handler where the return value doesn't matter
if "Space".onKeyDown() (
  void (
    playSound("jump"),
    character.jump(),
    updateScore(10)
  )
)
```

## Use Cases

The `void` command is particularly useful in these scenarios:

1. **Event handlers** - When executing code in response to events
2. **Initialization code** - When setting up components at startup
3. **Side effect functions** - When calling functions primarily for their side effects
4. **Cleanup operations** - When performing cleanup that returns values you don't need

## Notes

- The `void` command always evaluates its parameters fully
- It always returns `null` (though this return value is typically ignored)
- Using `void` can make your code more explicit about your intentions
- It's a good practice to use `void` when you're deliberately ignoring return values 