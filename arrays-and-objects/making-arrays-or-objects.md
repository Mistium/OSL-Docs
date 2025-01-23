# Making Arrays Or Objects

If you want a json editor, I suggest [https://www.jsonblob.com](https://www.jsonblob.com/) or [https://jsoncrack.com/editor](https://jsoncrack.com/editor)

## Creating Arrays

Arrays in OSL are 1-indexed collections that can hold any type of value.

```javascript
// Simple array
numbers = [1, 2, 3, 4, 5]

// Array with expressions
base = 10
computed = [base * 1, base * 2, base * 3]  // [10, 20, 30]

// Mixed type array
mixed = [1, "text", true, {x: 10}]

// Array with computed values
vals = [1 + 1, "pre" ++ "fix", 10 * 2]  // [2, "prefix", 20]
```

## Creating Objects

Objects are collections of key-value pairs that can include computed values and methods.

```javascript
// Simple object
person = {
    name: "John",
    age: 30
}

// Object with computed values
numbers = {
  num1: 0.5 * 2,
  num2: 1 * 2,
  num3: 1.5 * 2
}

log product.final()

// Object with methods
multiplier = 2
product = {
    price: 10,
    discount: 0.2,
    final: def() -> (
      return self.price * (1 - self.discount) * multiplier
   )
}

log product.final()
```

## Important Notes

- Arrays are 1-indexed (first element is at index 1)
- Objects can use `self` to reference their own properties
- Both arrays and objects can contain any OSL data type
- Values can be computed when creating arrays or objects
- Methods can be included in objects using `def() ->`
