# Strings - Slicing & Splitting

Methods that extract parts of a string or break it into an array.

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
