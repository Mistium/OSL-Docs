# Inline

## Advantages of Inline Functions

1. **Readability**: Inline functions promote a clean and organized code structure by encapsulating logic, making shaders easier to read and understand.
2. **Reusability**: Encapsulating repeated code snippets in inline functions reduces redundancy and allows for straightforward reuse across multiple parts of the shader.
3. **Maintainability**: Updates or bug fixes can be applied to the function definition once, automatically propagating improvements throughout the shader.
4. **Performance**: Although the entire code of an inline function is inserted wherever it is called, minimizing function overhead can improve runtime performance in some cases.

#### Example

Here's a basic example of an inline function that adds two numbers:

```javascript
add = def(x, y) -> (
  return x + y
)

// Usage
result = add(5.0, 3.0)
```

In this example, `add` is an inline function that takes two arguments, `x` and `y`, and returns their sum. This function can be called multiple times throughout your shader code to perform addition operations.

## Functions as arguments

In osl you can use a function as arguments for other functions, methods and commands. This allows for powerful new syntax such as the `.map()` method which iterates over each item in an array and overwrites it based on the function it is passed as argument.

```javascript
arr = [1,2,3,4,5]

log arr.map(def(this.item) -> (
  return this.item * 2
  // set each item to itself * 2
))

// [2,4,6,8,10]
```

You can also define a function earlier and then pass it as input

```javascript
arr = [1,2,3,4,5]

this.func = def(this.item) -> (
  return this.item * 2
  // set each item to itself * 2
)

log arr.map(this.func)
// pass the function as a parameter

// [2,4,6,8,10]
```
