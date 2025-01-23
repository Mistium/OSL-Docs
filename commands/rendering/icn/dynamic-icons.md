# Dynamic Icons

## Overview

Dynamic icons allow for interactive and responsive vector graphics. They can respond to variables, perform calculations, and conditionally render different elements.

## Enabling Dynamic Mode

To create a dynamic icon, the first line of the ICN file must be `@dynamic`:

```javascript
@dynamic
// rest of the icon code
```

## Variables

Variables from the environment can be accessed using the `$` prefix:

```javascript
$variableName
```

Example:
```javascript
@dynamic
c #fff
line 0 0 $mouseX $mouseY  // Draws line to mouse position
```

## Conditional Rendering

### Basic Syntax
```javascript
condition ( 
    // commands to execute if condition is true
)
```

Example:
```javascript
@dynamic
$value > 50 (
    c #00ff00
    dot 0 0
)
```

## Operations

### Comparison Operators
- `==` Equal to
- `!` Not equal to
- `<` Less than
- `>` Greater than

### Arithmetic Operators
- `+` Addition
- `-` Subtraction
- `/` Division
- `*` Multiplication
- `%` Modulo
- `^` Power

### Mathematical Functions
- `sin` Sine (degrees)
- `cos` Cosine (degrees)
- `tan` Tangent (degrees)
- `sqrt` Square root
- `abs` Absolute value
- `floor` Round down
- `ceil` Round up
- `round` Round to nearest integer
- `log` Natural logarithm
- `exp` Exponential

## Example: Clock Icon
```javascript
@dynamic
c #fff
w 20
dot 0 0

w 2 c #000
line 0 0 $minute * 6 sin * 6 $minute * 6 cos * 6
line 0 0 $hour * 4 sin * 4 $hour * 4 cos * 4

w 1.5 c #555
line 0 0 $second * 6 sin * 8 $second * 6 cos * 8
```

## Order of Evaluation

Operations are evaluated from left to right. For example:
```javascript
10 + 10 < 20 - 20  // Evaluates to -20
```

Evaluation steps:
1. `10 + 10` → `20 < 20 - 20`
2. `20 < 20 - 20` → `false - 20`
3. `false - 20` → `-20` 