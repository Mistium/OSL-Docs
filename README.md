# Syntax

OSL programming is made up of 6 different types of syntax.

### Commands

Commands are the backbone of most OSL scripts— generally, any operation involving modifying the program's state is done through them. They accept multiple inputs after the initial command, seperated by spaces. These inputs can be constants, such as raw strings or numbers, operators (which are defined later), or variables. Commands have no return value.
```javascript
command input1 input2 input3...
```
```javascript
// Moves the "draw cursor" to the origin of the screen.
goto 0 0

// Outputs the draw cursor's new location to the JavaScript console.
log x_position y_position
```

### Assignments

As the name suggests, assignments apply a value to the specified variable. The second token in an assignment will always be an [assignment operator](/basics/assignment-operators), usually taking the form of an equals sign (=). Assignments only take one input (aside from the initially specified variable), and do not have a return value.

```javascript
variable assignment input
```
```javascript
// Sets variable "var" to 10.
var = 10

// Inputs can also be previously defined variables.
varTwo = var
log varTwo
```

### Operators

Operators return a value based on a calculation. Operators can either be [equations](/operators/mathematical-usage) (addition, subtraction, division, etc.), [comparisons](/operators/comparative-operators) (==, <, >, etc.) or [logic gates](/operators/logical-operators) (and, or, nor, etc.). Unless parentheses are used, operators will always be processed from left to right, ignoring mathematical order of operations.

```javascript
// Variable "var" will be set to the solution of the operator equation.
var = 10 + 5

// Multiple operators can be strung together at once, but will be calculated left to right.
varTwo = var + 5 / 2

// Operators can assess logic gates.
log var == 15 and varTwo == 10
```

### Methods

Methods return a modified value based on a singular input. Methods can follow any constant or variable, and that value will act as it's input. Values inside the parentheses will act as parameters, although not every method will require those. In cases with multiple parameters, each value is seperated by a comma.

```javascript
// Logs the sine of 10 to the console.
log 10.sin()

// An example of a method with parameters; the parameter will be joined with the input.
var = "hello "
log var.concat("world")
```

Methods don't necessarily need to be part of another statement. In cases where a method is isolated, the input will automatically be updated to the method's return value.

```javascript
// These two lines are functionally equivalent.
var.method()
var = var.method()
```

### Functions

Functions are similar to methods, with the main difference being that functions do not take an input. Functions typically return a value, however this isn't strictly required— functions lacking an output won't throw an error, but instead output [null](/basics/types#null). Similarly to methods, functions can be run on their own, however no values will be modified.

```javascript
// Logs a random number 1 through 10.
log random(1, 10)

// An example of an isolated function with the parameters 10 and 5.
func(10, 5)
```

### Statements

Statements are containers for other commands, and modify their behavior through [looping the statement](/program-flow/iteration) or [ignoring it if the specified conditions aren't met](/program-flow/if-statements). Statements are always followed by a set of parentheses which surround a script. They generally take one or more inputs, supplied between the statement itself and the opening parenthesis.


```javascript
// The "if" statement only runs its commands if the input is true.
score = random(1, 15)
if score >= 10 (
  log "Required score met."
)

// The "loop" statement runs its commands multiple times.
loop 3 (
  log "Crazy? I was crazy once."
)

// Logs all values 1 through 10.
for i 10 (
  log i
)
```

## Getting Started

Below are some helpful pages to learn more about:
- [Basic Syntax](basics/types.md)
- [Program Flow](program-flow/if-statements/README.md)
- [String Methods](methods/strings/README.md)
- [Math Functions](functions/math/README.md)
- [Utility Methods](methods/utilities/README.md)
