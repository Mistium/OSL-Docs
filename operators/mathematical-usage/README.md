# Mathematical Usage

OSL supports the standard arithmetic operators on numbers. Each has its own page
below with examples and edge cases.

| Operator | Meaning |
| --- | --- |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `^` | Exponentiation (to the power of) |
| `%` | Modulo (remainder) |

Note that `+` adds numbers; to join strings without spacing use the
[`++`](../string-concatenation-operator.md) operator instead.

Integer `+`, `-`, and `*` are checked. A result outside the platform integer
range raises `OverflowError` rather than wrapping. OSL does not automatically
promote integers to arbitrary-precision values; use ordinary `number` values
when floating-point range is appropriate.
