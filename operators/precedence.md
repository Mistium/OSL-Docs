# Precedence

OSL evaluates expressions using a fixed operator precedence hierarchy. Operators with **higher precedence bind tighter** and are evaluated before lower-precedence operators. Operators at the same precedence level are evaluated **left-to-right**, unless otherwise stated.

Parentheses `(...)` may always be used to override precedence.

#### Precedence Table

<table data-header-hidden><thead><tr><th width="136.1881103515625"></th><th></th><th></th></tr></thead><tbody><tr><td>Level</td><td>Operators</td><td>Description</td></tr><tr><td>1</td><td><code>()</code></td><td>Grouping / explicit precedence override</td></tr><tr><td>2</td><td><code>+</code> <code>-</code> <code>/</code> <code>*</code> <code>^</code> <code>%</code> <code>??</code> <code>|></code></td><td>Operators</td></tr><tr><td>3</td><td><code>==</code> <code>!=</code> <code>&#x3C;</code> <code>></code> <code>&#x3C;=</code> <code>>=</code></td><td>Comparisons</td></tr><tr><td>4</td><td><code>bool ? val1 val2</code></td><td>Ternary operator</td></tr><tr><td>5</td><td><code>|</code> <code>&#x26;</code> <code>>></code> <code>&#x3C;&#x3C;</code> <code>>>></code> <code>^^</code> <code>&#x3C;&#x3C;&#x3C;</code> </td><td>Bitwise operators</td></tr><tr><td>6</td><td>and, or, nor, nand, xor, xand</td><td>Increment (prefix or postfix, context-dependent)</td></tr><tr><td>7</td><td><a data-mention href="../custom-syntax/inline.md">inline.md</a></td><td>Lambda and inline functions</td></tr></tbody></table>

This table is in order of what gets evaluated first, within these groups its the left most operator that takes precedence.

```javascript
// Think of:
log 1 + 1 * 4

// As:
log (1 + 1) * 4
```

Because operators come first in the table, they are evaluated before comparisons and so you can do things like this:

```javascript
// this logs `false`
log 1 + 1 == 5 * 4

// the code above is functionally equivalent to
log (1 + 1) == (5 * 4)
```
