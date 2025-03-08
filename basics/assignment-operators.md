# Assignment Operators

In osl you can use an assignment operator to set a variable to itself but modified by an operator. This allows you to compact code into a simpler format.&#x20;

An example of an assignment operator is `+=` where it adds a number to the variable or joins a string to the variable with a space

```javascript
variable = 10
// the variable is 10

variable += 10
// the variable is now 20
```

## All Assignment operators

```javascript
variable += number
// adds a number to the variable value

variable += string
// joins a string to the variable value with a space

variable -= number
// subtracts a number from the variable value

variable /= number
// divides the variable value by a number

variable *= number
// multiplies the variable value by a number

variable %= number
// sets the varable value to "variable % number"

variable ^= number
// sets the varable value to "variable ^ number"

variable ++= value
// concatonate the value onto the variable
```

## Increment/Decrement

```javascript
variable ++
// increase a variable by exactly 1

variable --
// decrease a variable by exactly 1
```

## Nullish Coalescence

[#nullish-coalescence](assignment-operators.md#nullish-coalescence "mention")

```javascript
variable ??= 10
// only sets the variable if the variable doesnt exist
```
