# Typed Variables

OSL allows you to declare variables with specific types, providing type safety and better code clarity. This feature enables you to enforce that a variable or object property can only hold values of a specified type.

## Syntax

For variables:

```javascript
type variableName = value
```

For object properties:

```javascript
type objectName.propertyName = value
```

## Supported Types

OSL supports the following type annotations for variables:

* `string` - Text values
* `number` - Numeric values (integers and decimals)
* `boolean` - Logical values (true/false)
* `array` - JSON arrays
* `object` - JSON objects
* `function` - Function objects
* `any` - Any type (default if no type is specified)

You can also suffix any type with `?` to allow it to be null or that type

## Examples

### Basic Type Declarations

```javascript
// Typed variable declarations
string name = "Alice"
number age = 30
boolean isActive = true
array items = [1, 2, 3]
object settings = { theme: "dark" }

// Attempting to assign the wrong type will cause an error
name = 42
// Error: Cannot assign number to string variable
```

### Typing Object Properties

You can also type specific properties of objects:

```javascript
// Create an object
user = {
  name: "Bob",
  age: 25,
  active: true
}

// Type a property
string user.name = "Charlie"
// Works fine
number user.age = 30
// Works fine

// This would cause an error
number user.name = 50  // Error: Cannot assign number to string property
```

### Type Enforcement

Once a variable or property is typed, OSL enforces that type for all future assignments:

```javascript
// Initial declaration with type
number score = 100

// Valid reassignments
score = 200
// Works fine
score = score + 50
// Works fine

// Invalid reassignments
score = "High"
// Error: Cannot assign string to number variable
score = true
// Error: Cannot assign boolean to number variable
```

### Working with Functions

Typed variables work well with functions that expect specific types:

```typescript
// Function that expects a number
def double(number val) (
  return val * 2
)

// Using typed variables with functions
number value = 5
result = double(value)
// Works fine

string text = "10"
result = double(text)
// Error: Function expected number but got string
```

### Type Conversion

If you need to change a value's type, you can use conversion methods:

```typescript
string textValue = "42"
number numValue = textValue.toNum()  // Convert string to number

number price = 19.99
string priceTag = price.toStr()      // Convert number to string
```

### Optional Types

If you add a `?` to the end of a type it makes it optional and allows the variable to be set to null or to that type.

```typescript
string myString = null
// will error

string? myString = null
// will succeed
```

This is super useful for when you want to initialise a typed variable early and set its value later.

## Benefits of Typed Variables

1. **Error Prevention** - Catch type-related errors early
2. **Code Clarity** - Make your intentions clear about what type a variable should hold
3. **Better Tooling Support** - Enable better code completion and hints
4. **Self-Documenting Code** - Types serve as documentation for your variables
5. **Improved Maintainability** - Makes code easier to understand and modify

## Notes

* Type annotations are optional - you can mix typed and untyped variables
* Type checking happens at runtime when assignments occur
* Once a variable is typed, that type is enforced for the lifetime of the variable
* Type annotations do not affect the variable's value, only what values it can accept
* Using typed variables can help catch bugs early and make your code more robust
