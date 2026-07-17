# .len

## Description

Len is a dynamic property, that returns the length of its input value.

## Parameters

Len takes no parameters

## Usage On Strings

```javascript
str = "12345"
// setup the string

log str.len
// returns 5
```

On strings, `.len` counts **bytes**, not characters - multi-byte characters count more than once, e.g. `"é".len` is `2`.
