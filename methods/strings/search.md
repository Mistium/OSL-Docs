# Strings — Searching & Testing

Methods that inspect a string's contents. Positions are **1-indexed**; "not found" is `0`.

#### `.contains(substr)` → `boolean`
Whether the string contains `substr`.

#### `.containsAny(...subs)` → `boolean`
Whether the string contains any one of the given substrings.

#### `.startsWith(prefix)` → `boolean`
Whether the string begins with `prefix`.

#### `.endsWith(suffix)` → `boolean`
Whether the string ends with `suffix`.

```javascript
log "report.csv".endsWith(".csv")  // true
log "abc".containsAny("x", "b")    // true
```

#### `.index(substr)` → `number`
Position of the first occurrence of `substr` (1-indexed), or `0` if absent.

#### `.lastIndex(substr)` → `number`
Position of the last occurrence (1-indexed), or `0` if absent.

#### `.count(substr)` → `number`
Number of times `substr` appears.

```javascript
log "hello world".index("o")     // 5
log "hello world".lastIndex("o") // 8
log "a-b-c".count("-")           // 2
```
