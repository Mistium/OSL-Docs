# Modulo Operator (%)

If you want to find the remainder of a division, you can use the percentage sign "%" to find it

```javascript
log 10 % 3
// does a division and returns the remainder of the division
// this is doing 10 / 3 and returning the remainder "1"
```

Floating-point remainder follows numeric semantics, including returning `NaN` when the
divisor is zero. Integer remainder by a known integer zero is rejected during compilation.
