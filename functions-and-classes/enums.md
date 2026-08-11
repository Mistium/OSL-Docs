# Enums

Enums are compact discriminated values. A variant may carry no data or one concrete payload.

## Declaring an enum

```javascript
enum FizzValue (
  Number(int)
  Fizz
  Buzz
  FizzBuzz
)
```

Variant names must be unique without regard to case. Payload variants currently accept exactly one type.

## Constructing variants

Payload-free variants are values. Payload variants are called with one argument.

```javascript
FizzValue word = FizzValue.Fizz
FizzValue number = FizzValue.Number(7)
```

Enums use value semantics and compare by their variant tag and payload.

```javascript
log word == FizzValue.Fizz  // true
```

## Tags and payloads

`.tag` returns the one-based numeric tag in declaration order. A payload is available through the lower-cased variant name.

```javascript
log number.tag     // 1
log number.number  // 7
```

Check the variant before reading its payload. Reading a payload field from another variant returns that payload type's zero value.

## Exhaustive matching

`match` is an expression that checks an enum's variant and binds the payload of
payload-carrying variants. Every declared variant must be listed.

```javascript
match value (
  FizzValue.Number(number): number
  FizzValue.Fizz: "Fizz"
  FizzValue.Buzz: "Buzz"
  FizzValue.FizzBuzz: "FizzBuzz"
)
```

The expression after `:` is returned implicitly. Use a block when an arm needs multiple
statements; the block must return a value explicitly.

```javascript
FizzValue.Number(number): (
  log number
  return number
)
```

Payload bindings are scoped to their arm. Duplicate variants, variants from another enum,
missing payload bindings, and non-exhaustive matches are compile-time errors.

`match` also supports switch-like scalar cases. Since arbitrary values cannot be proven
exhaustive, these matches require an `_` arm:

```javascript
label = match status (
  200: "ok"
  404: "missing"
  _: "other"
)
```

When converted to text, variants use `Variant` or `Variant(payload)` notation.

## Typed arrays

```javascript
FizzValue[] values = []
values.append(FizzValue.Number(1))
values.append(FizzValue.Fizz)
```

Generated Go uses a concrete tagged struct slice such as `[]OSL_FizzValue`, avoiding `[]any` and per-element allocation.
