# Strings - Slicing & Splitting

Methods that extract parts of a string or break it into an array.

#### Slice syntax `[from:to]`
`value[from:to]` is shorthand for `value.trim(from, to)` and works on both
strings and arrays. Indices are 1-based; either side may be omitted to run to
the start or the end.

```javascript
log "hello"[1:3]   // "hel"
log "hello"[:3]    // "hel"   (from the start)
log "hello"[2:]    // "ello"  (to the end)
log "hello"[:]     // "hello" (whole copy)
log [1, 2, 3, 4, 5][2:4]  // [2, 3, 4]
```

#### `.left(n)` → `string`
The first `n` characters.

#### `.right(n)` → `string`
The last `n` characters.

```javascript
log "Hello".left(2)   // "He"
log "Hello".right(2)  // "lo"
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
