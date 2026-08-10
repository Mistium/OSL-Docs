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

When converted to text, variants use `Variant` or `Variant(payload)` notation.

## Typed arrays

```javascript
FizzValue[] values = []
values.append(FizzValue.Number(1))
values.append(FizzValue.Fizz)
```

Generated Go uses a concrete tagged struct slice such as `[]OSL_FizzValue`, avoiding `[]any` and per-element allocation.
