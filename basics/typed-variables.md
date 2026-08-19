# Typed Variables

OSL allows you to declare variables with specific types, providing type safety and better code clarity. This feature enables you to enforce that a variable or object property can only hold values of a specified type.

Typed and inferred top-level assignments use the same exported Go reference detection.
The language server preserves the same declared names and types for indexing, completion and hover.

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
* `byte`, `int`, `int8`, `int16`, `int32`, `int64` - Integer values
* `number`, `number32`, `number64` - Numeric values
* `array`, `array<type>` - JSON arrays or typed element arrays
* `type[]` - Compact arrays whose elements use one specific type, such as `byte[]` or `int[]`
* `object`, `map<keyType, valueType>` - JSON objects or typed maps
* `set<type>` - Typed sets
* `result<valueType>`, `result<valueType, errorType>` - Typed results
* `function` - Function objects
* `any` - Any type (default if no type is specified)
* `auto` - Infer the variable type from the initial value

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
byte[] data = [0, 127, 255]
int[] counters = make(int[], 100)

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

Assigning a value of the wrong base type to an optional variable is still a compile error:

```typescript
number? x = 5
x = null    // fine
x = "hello" // TypeError: Cannot assign string to variable of type number?
```

`?` types work everywhere types are written — [function parameters](../functions-and-classes/typed-parameters.md#optional-parameters-type) (where trailing `?` parameters may also be omitted by the caller) and function return types:

```typescript
def pick(boolean which) number? (
  if which (
    return 42
  )
  return null
)
```

## Typed Arrays

Appending `[]` to a type creates a native Go slice of that element type. This uses substantially less memory than a dynamic `array` and avoids interface conversions when values are read:

```javascript
byte[] memory = make(byte[], 64 * 1024 * 1024)
memory[1] = 255
log memory[1]
```

Typed arrays use the same 1-based and negative indexing rules as normal OSL arrays. Number indexes are truncated to integers, so `values[2.9]` accesses item `2`. Literal values, indexed writes, and dynamic arrays assigned to a typed array are converted to the declared element type. Integer conversion follows Go-width wrapping, so assigning `258` to a `byte[]` stores `2`.

An indexed write outside the array's bounds is an error. The compiler reports it when both the
array length and the index bounds are known; otherwise the runtime reports it when the write is
attempted. Index `0` is never valid.

The size passed to `make(type[], size)` may be any integer expression. Concatenating two arrays of the same typed-array type preserves that type.

Use `type[size]` when the length is known at compile time. It creates a native fixed-size Go array, initializes omitted items to the element type's zero value, and avoids the slice header and allocation used by a dynamic typed array:

```javascript
int[4] counters = []
counters[1] = 10
counters[-1] = 40
log counters.len // 4
```

Fixed-size arrays use the same 1-based and negative indexing rules. Methods that change the collection length, such as `append`, `prepend`, `pop`, and `shift`, are compile errors. Use `type[]` with `make(type[], size)` when the size is only known at runtime or must change.

Use a dynamic `array` for mixed element types or a typed array for homogeneous, memory-sensitive data. A typed array widens implicitly to `array` when passed to a function that accepts the generic type. Homogeneous literals and nested inferred shapes retain precise types until a mutation requires widening them; object inference and mutation share the same literal-key decoding.

## Benefits of Typed Variables

1. **Error Prevention** - Catch type-related errors early
2. **Code Clarity** - Make your intentions clear about what type a variable should hold
3. **Better Tooling Support** - Enable better code completion and hints
4. **Self-Documenting Code** - Types serve as documentation for your variables
5. **Improved Maintainability** - Makes code easier to understand and modify

## Notes

* Type annotations are optional - you can mix typed and untyped variables
* Type annotations are preserved across cached local imports
* Type checking happens during compilation where the type is known, and the generated program enforces typed storage
* Once a variable is typed, that type is enforced for the lifetime of the variable
* Type annotations do not affect the variable's value, only what values it can accept
* Typed variables are tracked directly in compiler scopes; the nearest declaration wins and helps catch bugs early
