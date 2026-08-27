# If statements

An `if` statement runs a block only when its condition is true.

## Basic `if` statement

If the condition is false, execution continues after the block.

{% tabs %}
{% tab title="OSL" %}
```javascript
if 10 > 5 (
   log "10 is bigger than 5!"
)
```
{% endtab %}

{% tab title="JavaScript" %}
```javascript
if (10 > 5) {
   console.log("10 is bigger than 5!")
}
```
{% endtab %}

{% tab title="Python" %}
```python
if 10 > 5:
   print("10 is bigger than 5!")
```
{% endtab %}
{% endtabs %}

## `if else` statements

Add `else` to run another block when the condition is false.

Example:

```js
if condition (
   say "command1"
   say "command2"
) else (
   say "command3"
   say "command4"
)
```

## Inline flow guards

An `if` condition can directly precede `return`, `continue`, or `break` when the body contains only that flow statement:

```js
if user == null return {error: "User not found"}
if message == null continue
if complete break
```

`return` may include a value or return without one. `continue` and `break` do not accept values. Inline flow guards do not support `else`; use a normal block when an alternative branch is required.

## `else if` statements

Add `else if` to test another condition after the preceding condition fails. OSL runs the first matching block.

Example:

```js
if condition1 (
   say "command1"
   say "command2"
) else if condition2 (
   say "command3"
   say "command4"
)
```

## Conditions

* Conditions can involve logical operators (`and`, `or`, `nor`, `nand`) and comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`).
* Conditions may call functions that return booleans.
* `if` statements may be nested.

## Examples

### Basic `if` statement

```js
// Example of a basic if statement
// If the temperature is greater than 25, it's considered a hot day
temperature = 30
if temperature > 25 (
    say "It's a hot day!"
)
```

This prints the message because `temperature` is greater than 25.

### `if else` statement

```js
// Example of an if-else statement
// Determines if a person is an adult or a minor based on their age
age = 17

if age >= 18 (
    say "You are an adult."
) else (
    say "You are a minor."
)
```

This prints one of the two messages based on whether `age` is at least 18.

### `else if` statement

```js
// Example of an else-if statement
// Assigns a letter grade based on a numerical grade
grade = 85

if grade >= 90 (
    say "You got an A."
) else if grade >= 80 (
    say "You got a B."
) else if grade >= 70 (
    say "You got a C."
) else (
    say "You need to improve your grade."
)
```

The conditions run from highest grade to lowest. The final `else` handles grades below 70.
