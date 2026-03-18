# `void`

The `void` command evaluates its parameters but discards the result. It's useful when you want to execute a function or expression for its side effects **without letting its return value overwrite an existing variable**.

## Syntax

```javascript
void expression
```

## Description

The `void` command takes an expression, evaluates it fully, and then discards the result.

In this language, many methods **mutate the original value and also return a result**. That means calling a method directly can unintentionally overwrite your variable if you're not careful.

### Example of default behavior

```javascript
myString = "HELLO WORLD"

myString.toLower()

log myString
// "hello world"
```

Here, calling `toLower()` modifies `myString`.

## Preventing Overwrites with `void`

If you want to execute the method **without changing the original variable**, you can use `void`:

```javascript
myString = "HELLO WORLD"

void myString.toLower()

log myString
// "HELLO WORLD"
```

The method is still evaluated, but its result is discarded and **the original value remains unchanged**.

### Mutation from Methods

```javascript
numbers = [3, 1, 2]

// Because .sort() mutates the value in place, this works
void numbers.sort()

log numbers
// [1, 2, 3]
```

## Use Cases

* Preventing accidental overwrites of variables
* Running methods without mutating original data
* Executing side-effect-only functions
* Making it explicit that a return value is intentionally ignored

## Notes

* `void` always evaluates the expression
* The result is discarded and not assigned anywhere
* It effectively preserves the original value when used with mutating methods
* Using `void` makes your intent clearer when ignoring results
