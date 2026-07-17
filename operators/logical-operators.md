# Logical Operators

When working with comparative operators, it is incredibly useful to be able to quickly and concisely check the comparisons meet certain conditions.

## Execution Order

Logical operators like `and` and `or` are evaluated **after** all other comparisons or expressions on either side of the operator are evaluated. This means that, in an expression such as `10 == 10 and true`, the comparison `10 == 10` is evaluated **first**, returning `true`. Then, the logical `and` operation is performed.

## AND

A logical and statement will evaluate both of its operands, and if they are both truthy, then it will return true, otherwise it will return false. Unlike `or`, `and` always returns a boolean, not one of its operands. The way you write an `and` operator in osl is simply a lowercase `and`.

You can see the truth table below

| A     | B     | A and B |
| ----- | ----- | ------- |
| true  | true  | true    |
| true  | false | false   |
| false | true  | false   |
| false | false | false   |

```javascript
log true and true
// this returns true

log 10 == 10 and true
// this returns true
// 10 == 10 is true
// true is true
// therefore both sides are true and the overall operator returns true
```

## OR

A logical or statement returns its **first operand if it is truthy, otherwise its second operand** - like JavaScript's `||`, it returns one of the operands rather than always returning a boolean. This makes it useful for fallback values. The way you write an `or` operator in osl is simply a lowercase `or`.

When both operands are booleans this matches the classic truth table below

| A     | B     | A or B |
| ----- | ----- | ------ |
| true  | true  | true   |
| true  | false | true   |
| false | true  | true   |
| false | false | false  |

```javascript
log true or false
// true

log 0 or 5
// 5 - the left operand is falsy, so the right operand is returned

log "a" or "b"
// "a" - the left operand is truthy, so it is returned

log null or "fallback"
// "fallback"
```

Note that `and` and `or` are asymmetric: `and` always returns a boolean, while `or` returns one of its operands.

Be careful with numeric truthiness: a whole number is only considered truthy when it equals exactly `1` (fractional non-zero values like `5.5` are also truthy). So `2 or 3` returns `3`, because `2` is not treated as truthy. To fall back only on `null`, use the [nullish coalescing operator](nullish-coalescing-operator.md) (`??`) instead.

## NOR

A logical nor statement will evaluate both of its operands, and if neither of them are true, then it will return true, otherwise it will return false. The way you write a `nor` operator in osl is simply a lowercase `nor`.

You can see the truth table below

| A     | B     | A nor B |
| ----- | ----- | ------- |
| true  | true  | false   |
| true  | false | false   |
| false | true  | false   |
| false | false | true    |

```javascript
log true nor false
// this returns false
```

## XOR

A logical xor statement will evaluate both of its operands, and if both are true or both are false, then it will return false, otherwise it will return true. The way you write a `xor` operator in osl is simply a lowercase `xor`.

You can see the truth table below

| A     | B     | A xor B |
| ----- | ----- | ------- |
| true  | true  | false   |
| true  | false | true    |
| false | true  | true    |
| false | false | false   |

```javascript
log true xor false
// this returns true
```

## XNOR

A logical xnor statement will evaluate both of its operands, and if both of them are true or both of them are false, then it will return true, otherwise it will return false. The way you write a `xnor` operator in osl is simply a lowercase `xnor`.

You can see the truth table below

| A     | B     | A xnor B |
| ----- | ----- | -------- |
| true  | true  | true     |
| true  | false | false    |
| false | true  | false    |
| false | false | true     |

```javascript
log true xnor false
// this returns false
```

## NAND

A logical nand statement will evaluate both of its operands, and if both of them aren't true, then it will return true, otherwise it will return false. The way you write a `nand` operator in osl is simply a lowercase `nand`.

You can see the truth table below

| A     | B     | A nand B |
| ----- | ----- | -------- |
| true  | true  | false    |
| true  | false | true     |
| false | true  | true     |
| false | false | true     |

```javascript
log true nand false
// this returns true
// nand is literally "not and" so it will return the opposite of an and statement
```

## NOT

The `NOT` statement negates the truth value of its operand. In the context of osl, you can apply it using an exclamation mark (`!`) before a value or group of values. Here's how it works:

* `!true` evaluates to `false`.
* `!false` evaluates to `true`.

In osl, you can also use the `!` operator in conjunction with logical operators to achieve similar effects. For instance, `!(false and true)` evaluates to `true` since the `AND` operation between `false` and `true` is `false`, and the `NOT` operation negates it.

```javascript
log !true
// false

log !(true and true)
// false
```
