# Bitwise operators

Currently osl has support for:\


## Bitwise AND

Bitwise `and` for osl is identical to bitwise `and` in js

{% embed url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND" %}

```javascript
log 101 & 100
// 100
```

## Bitwise OR

Bitwise `or` for osl is identical to bitwise `or` in js

{% embed url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR" %}

```javascript
log 101 | 100
// 101
```

## Bitwise XOR (^^)

The bitwise XOR operator (^^) returns 1 for each bit position where the corresponding bits of its operands are different.

```javascript
// Basic XOR operations
5 ^^ 3    // Returns 6 (binary: 101 ^^ 011 = 110)
12 ^^ 5   // Returns 9 (binary: 1100 ^^ 0101 = 1001)

// Common uses
// Toggle bits
flag = flag ^^ 1  // Toggles the least significant bit

// Swap variables without a temporary variable
a = 5
b = 3
a = a ^^ b  // a = 6
b = a ^^ b  // b = 5
a = a ^^ b  // a = 3
```

## Bitwise Left Shift (<<)

The left shift operator (<<) shifts the bits of the first operand to the left by the number of positions specified by the second operand.

```javascript
// Basic left shift operations
5 << 1     // Returns 10 (binary: 101 becomes 1010)
3 << 2     // Returns 12 (binary: 11 becomes 1100)

// Common uses
// Quick multiplication by powers of 2
num = 4 << 1  // Same as 4 * 2 = 8
num = 4 << 2  // Same as 4 * 4 = 16
num = 4 << 3  // Same as 4 * 8 = 32
```

## Bitwise Right Shift (>>)

The right shift operator (>>) shifts the bits of the first operand to the right by the number of positions specified by the second operand.

```javascript
// Basic right shift operations
8 >> 1     // Returns 4 (binary: 1000 becomes 0100)
12 >> 2    // Returns 3 (binary: 1100 becomes 0011)

// Common uses
// Quick division by powers of 2
num = 16 >> 1  // Same as 16 / 2 = 8
num = 16 >> 2  // Same as 16 / 4 = 4
num = 16 >> 3  // Same as 16 / 8 = 2
```

## Important Notes

1. **Operator Precedence**
   - Bitwise operators have lower precedence than arithmetic operators
   - Use parentheses to ensure operations are performed in the intended order

2. **Type Handling**
   - Operands are converted to integers before the operation
   - Results are always integers
   - Negative numbers use two's complement representation

3. **Common Use Cases**
   - Bit manipulation in flags and masks
   - Fast multiplication/division by powers of 2
   - Memory-efficient storage of boolean values
   - Data encryption and hashing algorithms

4. **Best Practices**
   - Use comments to explain complex bitwise operations
   - Consider readability vs. performance when choosing between bitwise and arithmetic operations
   - Be careful with shift amounts larger than the number's bit width
