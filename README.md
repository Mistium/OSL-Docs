# Syntax

OSL programming is made up of 6 different types of syntax.

### Commands

Commands are the backbone of all osl scripting, they take inputs and return nothing. Inputs can be raw data, such as a string

```javascript
command input input input

goto 0 0
```

### Assignments

Assignments are any line that has an assignment operator as the second token.

```javascript
variable assignment input

var = 10
```

### Methods

Methods allow you to modify the data you input into them, and they do return a value.

```javascript
log 10.sin()
// logs the sin of 10 to the console
```

Using Methods As Commands

```javascript
variable.method()
// this will set the value in the variable to the result of the method.

variable = variable.method()
// this is equivalent
```

### Functions

Functions take parameters and no inputs, and are mostly used for when the function isn’t meant to modify any specific variable but rather calculate a value based on its parameters

```javascript
log min(10,5)
// logs 5 to the console

func(10,5)
// runs the function with the parameters 10 and 5
```

### Statements

Statements are containers for commands, and allow for conditionals and looping.

Examples of statements are shown below:

```javascript
if boolean (

)

loop 10 (

)

for i 10 (

)
```

### Operators

Operators take in values from their left and right tokens and calculate a response to replace itself and those two tokens with the output of the calculation. Operators include logic like and, or, nor, nand.. etc.

```javascript
log 10 + 5
// logs 15 to the console

// when this is evaluated, the script becomes
log 15

// all evaluation of operators are done from left to right
```

## Getting Started

Browse through the documentation sections to learn more about:
- [Basic Syntax](basics/types.md)
- [Program Flow](program-flow/if-statements/README.md)
- [String Methods](methods/strings/README.md)
- [Math Functions](functions/math/README.md)
- [Utility Methods](methods/utilities/README.md)
