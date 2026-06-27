# Strings — Slicing & Splitting

Methods that extract parts of a string or break it into an array.

#### `.left(n)` → `string`
The first `n` characters.

#### `.right(n)` → `string`
The substring starting at position `n` (1-indexed) through the end.

> Watch the asymmetry: `.left(n)` returns the first `n` characters, but `.right(n)` returns
> everything **from position `n` onward** — not the last `n` characters. (Array `.right(n)`, by
> contrast, *does* return the last `n` — see [Array slicing](../arrays/converting.md).)

```javascript
log "Hello".left(2)   // "He"
log "Hello".right(2)  // "ello"
```

#### `.split(delim)` → `array`
Splits the string on `delim` into an array of substrings.

```javascript
log "a,b,c".split(",")  // ["a", "b", "c"]
```

#### `.toArr()` → `array`
Splits the string into an array of single-character strings.

```javascript
log "abc".toArr()  // ["a", "b", "c"]
```
