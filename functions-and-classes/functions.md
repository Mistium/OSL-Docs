# Functions

In OSL, you can define custom functions to modularize and reuse your code. Functions can take multiple parameters, perform operations, and return results. These functions can be invoked with specific arguments and used throughout your script.

## Defining a Custom Function

To define a custom function, use the `def` keyword followed by the function name
and parameters. Declare local variables inside the function with `any`, `auto`,
or another type keyword.

## Return Types

A return type can be written between the parameter list and the body. It may be
any type keyword, including collection types at any nesting depth — `object[]`,
`string[]`, `number[]`, `object[][]`, `string[][][]`, and so on. When a return
type is declared, OSL checks every `return` and coerces array/object literals to
match it — so `return []`, `return [{...}]`, and `return [[{...}]]` all satisfy
the matching array return type.

```javascript
def handleAuth(object msg) object[] (
  return [{cmd: "ok", val: msg.key}]
)

def handleCmd(object msg) object[] (
  switch msg.cmd (
    case "auth"
      return handleAuth(msg)
    default
      return []
  )
)

object[] resp = handleCmd({cmd: "auth", key: "abc"})
```

Returning a value whose type can't match the declared return type (for example a
`number` from an `object[]` function) raises a compile error at the `return`.

A return type with a trailing `?` (e.g. `number?`) is nullable — the function may
return either the base type or `null`:

```javascript
def pick(boolean which) number? (
  if which (
    return 42
  )
  return null
)
```

## Optional Parameters

A parameter typed with a trailing `?` (e.g. `number? add`) is nullable and, when
it comes after all required parameters, may be omitted by the caller — it defaults
to `null`. See [Typed Parameters](typed-parameters.md) for details.

```javascript
def silly(number value, number? add) number (
  if add == null (
    return value
  )
  return value + add
)

log silly(10, 10) // 20
log silly(10)     // 10
```

## Example: Basic Arithmetic Function

Here's how you can create a function that performs basic arithmetic operations and returns a result:

```javascript
def calculate(num1, num2, operation) (
  any result = null
  switch operation (
    case "add"
      result = num1 + num2
      break
    case "subtract"
      result = num1 - num2
      break
    case "multiply"
      result = num1 * num2
      break
    case "divide"
      result = num1 / num2
      break
  )
  return result
)

log calculate(10,5,"add")
// Outputs: 15
log calculate(10,5,"subtract")
// Outputs: 5
log calculate(10,5,"multiply")
// Outputs: 50
log calculate(10,5,"divide")
// Outputs: 2
```

## Example: String Manipulation Function

You can also define functions to perform operations on strings. Here's an example of a function that reverses a string:

```javascript
def reverseString(text) (
  string reversed = ""
  number i = text.len
  loop text.len (
    reversed ++= text[i]
    i --
  )
  return reversed
)

log reverseString("hello")  // Outputs: "olleh"
```

## Example: Combining Functions

You can define helper functions and call them from other parts of your program:

```javascript
def greet(name) (
  string message = "Hello, " ++ name ++ "!"
  return message
)

say greet("Alice")
// Outputs: "Hello, Alice!"
```

## Example: Complex Data Processing

Custom functions can also handle complex data processing, such as filtering an array:

```javascript
def filterEvenNumbers(nums) (
  array even = []
  for i nums.len (
    if nums[i] % 2 == 0 (
      even.append(nums[i])
    )
  )
  return even
)

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
log filterEvenNumbers(data)  // Outputs: [2, 4, 6, 8, 10]

// or you can use .filter()
log data.filter(num -> (num % 2 == 0))  // Outputs: [2, 4, 6, 8, 10]
```

## Functions are Stored As Variables

Whenever you define a function, it is stored as a variable, the same way that [inline.md](inline.md "mention")functions are stored.

```javascript
def myfunc() (

)

log myfunc
// logs the function object
```

This means you can assign a function to another variable and call it through the
new name:

```javascript
def myfunc() (
  return 10
)

myNewFunc = myfunc

log myNewFunc()
// logs 10
```
